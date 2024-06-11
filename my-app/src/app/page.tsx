import Link from "next/link";
import Contact from './contact/page';
import Login from './login/page';
import Register from './register/page';
import Faq from './faq/page';
import Features from './features/page'

export default function Page(){
  return (
  <div>
    <Features/>
    <Faq/>
    <Contact/>
    <Register/>
  </div>
);

}
