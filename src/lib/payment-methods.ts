import {
  BankIcon,
  ClockIcon,
  CreditCardIcon,
  QrCodeIcon,
  StoreIcon,
  WalletIcon,
} from "@/components/icons";

export const paymentMethods = [
  { icon: QrCodeIcon, label: "QRIS", detail: "Scan sekali, semua e-wallet" },
  { icon: WalletIcon, label: "E-Wallet", detail: "GoPay, OVO, DANA, ShopeePay" },
  { icon: BankIcon, label: "Transfer Bank", detail: "Virtual account semua bank" },
  { icon: CreditCardIcon, label: "Kartu Kredit", detail: "Visa, Mastercard" },
  { icon: ClockIcon, label: "Paylater", detail: "Cicilan tanpa kartu" },
  { icon: StoreIcon, label: "Minimarket", detail: "Alfamart" },
];
