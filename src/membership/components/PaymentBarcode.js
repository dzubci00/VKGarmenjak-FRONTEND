import React, { useEffect, useRef } from "react";
import "../components/Payment.css"
import bwipjs from "bwip-js";

const PaymentBarcode = ({ paymentData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (paymentData) {
      try {
        bwipjs.toCanvas(canvasRef.current, {
          bcid: "pdf417",  // PDF417 format
          text: paymentData,
          scale: 2, 
          height: 30,
          includetext: true,
        });
      } catch (e) {
        console.error("Greška kod generiranja PDF417 barkoda:", e);
      }
    }
  }, [paymentData]);

  return <canvas className="canvas" ref={canvasRef}></canvas>;
};

export default PaymentBarcode;