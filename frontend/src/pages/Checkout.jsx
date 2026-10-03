import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Loader2,
  Copy,
  ShieldCheck,
} from "lucide-react";

import { useApp } from "@/lib/AppContext";
import { formatINR } from "@/lib/format";

const API = "http://localhost:8081";

const CHECKOUT_STORAGE_KEY =
  "galerie_active_checkout";

export default function Checkout() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    loadingCart,
  } = useApp();

  const navigate = useNavigate();

  const createStarted = useRef(false);

  const [stage, setStage] = useState("loading");

  const [order, setOrder] = useState(null);

  const [payment, setPayment] = useState(null);

  const [transactionId, setTransactionId] =
    useState("");

  const [error, setError] = useState("");

  const [copied, setCopied] =
    useState("");

  /*
   * Create a stable fingerprint of the current cart.
   *
   * This lets us know whether an existing pending
   * checkout belongs to the current cart.
   */
  const getCartFingerprint = () => {
    return cartItems
      .map((item) => ({
        id: item.id,
        productId:
          item.productId ||
          item.product?.id,
        quantity: Number(
          item.quantity || 1
        ),
        price: Number(
          item.product?.price || 0
        ),
      }))
      .sort((a, b) => {
        return Number(a.id || 0) -
          Number(b.id || 0);
      });
  };

  /*
   * Load payment information for an existing order.
   */
  const loadPayment = async (
    paymentId
  ) => {
    const paymentResponse =
      await fetch(
        `${API}/api/payments/${paymentId}`,
        {
          credentials: "include",
        }
      );

    const paymentData =
      await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(
        paymentData.message ||
          paymentData.error ||
          "Unable to load payment"
      );
    }

    setPayment(paymentData);

    return paymentData;
  };

  /*
   * Resume a previously-created order
   * instead of creating another one.
   */
  const resumeExistingCheckout = async (
    storedCheckout
  ) => {
    try {
      setError("");

      const existingOrder = {
        orderId:
          storedCheckout.orderId,
        paymentId:
          storedCheckout.paymentId,
        total:
          Number(
            storedCheckout.total || 0
          ),
      };

      setOrder(existingOrder);

      await loadPayment(
        storedCheckout.paymentId
      );

      setStage("pay");

      return true;

    } catch (err) {
      console.error(
        "Existing checkout could not be resumed:",
        err
      );

      /*
       * The saved checkout is no longer valid.
       * Remove it and create a fresh one.
       */
      sessionStorage.removeItem(
        CHECKOUT_STORAGE_KEY
      );

      return false;
    }
  };

  /*
   * Create exactly ONE backend order
   * for the current checkout.
   */
  const createOrder = async () => {
    if (createStarted.current) {
      return;
    }

    createStarted.current = true;

    if (
      loadingCart ||
      cartItems.length === 0
    ) {
      createStarted.current = false;
      return;
    }

    try {
      setStage("loading");
      setError("");

      const fingerprint =
        getCartFingerprint();

      /*
       * Check whether this browser already has
       * a pending GALERIE checkout.
       */
      const saved =
        sessionStorage.getItem(
          CHECKOUT_STORAGE_KEY
        );

      if (saved) {
        try {
          const storedCheckout =
            JSON.parse(saved);

          const sameCart =
            JSON.stringify(
              storedCheckout.cartFingerprint
            ) ===
            JSON.stringify(
              fingerprint
            );

          if (
            sameCart &&
            storedCheckout.orderId &&
            storedCheckout.paymentId
          ) {
            const resumed =
              await resumeExistingCheckout(
                storedCheckout
              );

            if (resumed) {
              return;
            }
          }
        } catch (err) {
          console.error(
            "Invalid saved checkout:",
            err
          );

          sessionStorage.removeItem(
            CHECKOUT_STORAGE_KEY
          );
        }
      }

      /*
       * No matching checkout exists.
       *
       * Create exactly one backend order.
       */
      const response =
        await fetch(
          `${API}/api/orders`,
          {
            method: "POST",
            credentials: "include",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to create order"
        );
      }

      setOrder(data);

      /*
       * Save checkout immediately.
       *
       * If the user refreshes the page,
       * we reuse this order instead of
       * creating another one.
       */
      sessionStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify({
          orderId:
            data.orderId,
          paymentId:
            data.paymentId,
          total:
            Number(
              data.total ||
                data.totalAmount ||
                cartTotal ||
                0
            ),
          cartFingerprint:
            fingerprint,
        })
      );

      /*
       * Load payment details.
       */
      await loadPayment(
        data.paymentId
      );

      setStage("pay");

    } catch (err) {
      console.error(
        "Checkout creation failed:",
        err
      );

      setError(
        err.message ||
          "Unable to start checkout"
      );

      setStage("error");

    } finally {
      createStarted.current = false;
    }
  };

  /*
   * Start checkout only after the real cart
   * has finished loading.
   */
  useEffect(() => {
    if (loadingCart) {
      return;
    }

    if (cartItems.length === 0) {
      setStage("empty");
      return;
    }

    createOrder();

  }, [loadingCart]);

  const copyText = async (
    value,
    type
  ) => {
    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(type);

      setTimeout(
        () => setCopied(""),
        1500
      );

    } catch (err) {
      console.error(err);
    }
  };

  const verifyPayment = async () => {
    if (!transactionId.trim()) {
      setError(
        "Paste your Algorand transaction ID first."
      );
      return;
    }

    if (!payment?.id) {
      setError(
        "Payment information is missing."
      );
      return;
    }

    try {
      setStage("verifying");
      setError("");

      const response =
        await fetch(
          `${API}/api/payments/${payment.id}/verify`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              transactionId:
                transactionId.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Payment verification failed"
        );
      }

      if (!data.confirmed) {
        setError(
          data.message ||
            "Transaction is not confirmed yet."
        );

        setStage("pay");
        return;
      }

      /*
       * Payment is confirmed.
       *
       * Now remove the active checkout lock.
       */
      sessionStorage.removeItem(
        CHECKOUT_STORAGE_KEY
      );

      await clearCart();

      setStage("done");

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Payment verification failed."
      );

      setStage("pay");
    }
  };

  /*
   * LOADING
   */
  if (stage === "loading") {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />

        <h1 className="font-display font-700 text-2xl text-foreground">
          Preparing checkout...
        </h1>

        <p className="text-sm text-muted-foreground mt-2">
          Creating your secure order.
        </p>
      </div>
    );
  }

  /*
   * EMPTY
   */
  if (stage === "empty") {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h1 className="font-display font-700 text-2xl text-foreground">
          Nothing to check out
        </h1>

        <Link
          to="/shop"
          className="text-accent text-sm mt-3 inline-block"
        >
          Browse the gallery
        </Link>
      </div>
    );
  }

  /*
   * ERROR
   */
  if (stage === "error") {
    return (
      <div className="pt-32 pb-20 px-4 max-w-lg mx-auto">
        <div className="rounded-3xl glass-strong p-8 text-center">

          <h1 className="font-display font-700 text-2xl text-foreground mb-3">
            Checkout couldn't start
          </h1>

          <p className="text-sm text-red-400 mb-6">
            {error}
          </p>

          <button
            onClick={() => {
              sessionStorage.removeItem(
                CHECKOUT_STORAGE_KEY
              );

              createStarted.current = false;

              setStage("loading");

              createOrder();
            }}
            className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold"
          >
            Try again
          </button>

        </div>
      </div>
    );
  }

  /*
   * DONE
   */
  if (stage === "done") {
    return (
      <div className="pt-28 pb-20 px-4 max-w-2xl mx-auto">
        <div className="rounded-3xl glass-strong p-10 text-center glow-violet">

          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="font-display font-700 text-3xl text-foreground mb-2">
            Order confirmed
          </h1>

          <p className="text-sm text-muted-foreground mb-2">
            Your Algorand Testnet payment was verified.
          </p>

          <p className="font-display font-700 text-3xl text-foreground my-5">
            {formatINR(
              order?.total ||
                cartTotal
            )}
          </p>

          <p className="text-xs text-muted-foreground mb-6">
            Order #{order?.orderId}
          </p>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="px-7 py-3 rounded-full bg-foreground text-background text-sm font-semibold"
          >
            View orders
          </button>

        </div>
      </div>
    );
  }

  /*
   * PAYMENT PAGE
   */
  return (
    <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">

      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to cart
      </Link>

      <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground mb-6">
        Checkout
      </h1>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_340px] gap-6">

        <div className="space-y-5">

          {/* ORDER */}

          <div className="rounded-3xl glass-strong p-5">

            <div className="flex items-center justify-between mb-4">

              <h2 className="font-display font-600 text-lg text-foreground">
                Order #{order?.orderId}
              </h2>

              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400">
                PAYMENT PENDING
              </span>

            </div>

            <div className="space-y-3">

              {cartItems.map((item) => {

                const product =
                  item.product;

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const price =
                  Number(
                    product?.price || 0
                  );

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 text-sm"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <img
                        src={
                          product?.imageUrl ||
                          "https://placehold.co/80x80?text=GALERIE"
                        }
                        alt={
                          product?.name ||
                          "Product"
                        }
                        className="w-12 h-12 rounded-xl object-cover"
                      />

                      <div className="min-w-0">

                        <p className="text-foreground truncate">
                          {product?.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          × {quantity}
                        </p>

                      </div>

                    </div>

                    <span className="font-medium text-foreground">
                      {formatINR(
                        price * quantity
                      )}
                    </span>

                  </div>
                );
              })}

            </div>
          </div>

          {/* PAYMENT */}

          <div className="rounded-3xl glass-strong p-6">

            <div className="flex items-center gap-2 mb-1">

              <ShieldCheck className="w-5 h-5 text-accent" />

              <h2 className="font-display font-600 text-lg text-foreground">
                Pay with Algorand
              </h2>

            </div>

            <p className="text-xs text-muted-foreground mb-5">
              Algorand Testnet · no real money
            </p>

            {payment && (
              <div className="space-y-4">

                <div className="rounded-2xl glass p-5 text-center">

                  <p className="text-xs text-muted-foreground mb-1">
                    Amount to send
                  </p>

                  <p className="font-display font-700 text-3xl text-foreground">
                    {Number(
                      payment.amountAlgo
                    ).toFixed(6)}{" "}
                    ALGO
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {formatINR(
                      Number(
                        payment.amountInr
                      )
                    )}
                  </p>

                </div>

                <div>

                  <label className="text-xs text-muted-foreground">
                    GALERIE merchant address
                  </label>

                  <div className="flex gap-2 mt-2">

                    <input
                      readOnly
                      value={
                        payment.merchantAddress
                      }
                      className="flex-1 min-w-0 rounded-xl glass px-3 py-3 text-xs text-foreground"
                    />

                    <button
                      onClick={() =>
                        copyText(
                          payment.merchantAddress,
                          "address"
                        )
                      }
                      className="px-3 rounded-xl glass hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                  </div>

                  {copied === "address" && (
                    <p className="text-[11px] text-emerald-400 mt-1">
                      Copied
                    </p>
                  )}

                </div>

                <div>

                  <label className="text-xs text-muted-foreground">
                    Payment URI
                  </label>

                  <div className="flex gap-2 mt-2">

                    <input
                      readOnly
                      value={
                        payment.paymentUri
                      }
                      className="flex-1 min-w-0 rounded-xl glass px-3 py-3 text-[11px] text-foreground"
                    />

                    <button
                      onClick={() =>
                        copyText(
                          payment.paymentUri,
                          "uri"
                        )
                      }
                      className="px-3 rounded-xl glass"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                <div className="rounded-2xl bg-accent/10 border border-accent/20 p-4">

                  <p className="text-sm font-semibold text-foreground mb-2">
                    1. Send the exact amount
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Send{" "}
                    {Number(
                      payment.amountAlgo
                    ).toFixed(6)}{" "}
                    ALGO on Algorand Testnet to the merchant address above.
                  </p>

                  <p className="text-sm font-semibold text-foreground mt-4 mb-2">
                    2. Paste the transaction ID
                  </p>

                  <p className="text-xs text-muted-foreground">
                    After the transaction confirms, paste its ID below.
                  </p>

                </div>

                <div>

                  <label className="text-xs text-muted-foreground">
                    Algorand transaction ID
                  </label>

                  <input
                    value={transactionId}
                    onChange={(e) =>
                      setTransactionId(
                        e.target.value
                      )
                    }
                    placeholder="Paste transaction ID"
                    className="w-full mt-2 rounded-xl glass px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/40"
                  />

                </div>

                <button
                  onClick={verifyPayment}
                  disabled={
                    stage === "verifying" ||
                    !transactionId.trim()
                  }
                  className="w-full px-5 py-3.5 rounded-2xl bg-accent text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >

                  {stage === "verifying" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying on Algorand...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Verify payment
                    </>
                  )}

                </button>

                <p className="text-[11px] text-muted-foreground text-center">
                  Your order is confirmed only after the Testnet transaction is verified.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* SUMMARY */}

        <div className="h-fit lg:sticky lg:top-28 rounded-3xl glass-strong p-6">

          <h2 className="font-display font-600 text-lg text-foreground mb-4">
            Summary
          </h2>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="text-foreground">
                {formatINR(
                  cartTotal
                )}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Delivery
              </span>

              <span className="text-foreground">
                Free
              </span>

            </div>

          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">

            <span className="font-semibold text-foreground">
              Total
            </span>

            <span className="font-display font-700 text-2xl text-foreground">
              {formatINR(
                cartTotal
              )}
            </span>

          </div>

          <div className="mt-5 text-xs text-muted-foreground">
            Algorand Testnet
          </div>

        </div>

      </div>
    </div>
  );
}