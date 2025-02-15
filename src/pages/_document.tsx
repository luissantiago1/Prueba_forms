import { Html, Head, Main, NextScript } from "next/document";
import NavBar from "./components/NavBar";
import Footer from "./components/footer";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <NavBar />
        <Main />
        <Footer/>
        <NextScript />
      </body>
    </Html>
  );
}
