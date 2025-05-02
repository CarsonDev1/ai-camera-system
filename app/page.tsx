import { redirect } from "next/navigation"

export default function Home() {
  // Chuyển hướng từ trang chủ đến trang phân tích dữ liệu
  redirect("/tong-quan/phan-tich-du-lieu")
}
