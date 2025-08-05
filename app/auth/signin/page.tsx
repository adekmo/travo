export const metadata = generateMetadata({
  title: "Masuk ke Akun Anda | Travoo",
  description: "Masuk untuk mulai memesan paket wisata favorit Anda.",
});


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SigninForm from "@/components/SigninForm";
import { generateMetadata } from "@/lib/metadata";

const SignInPage = async () => {

    const session = await getServerSession(authOptions);

    if (session) {
      redirect("/packages");
    }
  return (
    <>
      <SigninForm />
    </>
  )
}

export default SignInPage