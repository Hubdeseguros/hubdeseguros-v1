import React from "react";
import { usePaymentNotifications } from "@/hooks/usePaymentNotifications";

// This component runs at the root and registers all global side effects, like payment notifications.
const GlobalEffects: React.FC = () => {
  usePaymentNotifications();
  return null; // No visible UI
};

export default GlobalEffects;
