import Navbar from "./components/Navbar";
import header from './assets/imgs/home.png';
import Image from "next/image";
import Link from "next/link";
import Tools from "./components/Tools";

export default function Home() {
  return (
   <main>
    <Navbar />
    <article className="bg-[#CACDFE]  mx-0">
      <section className="text-center p-8 flex justify-center flex-col items-center gap-2">
        <h1 className="text-3xl text-black font-bold mb-4 w-[90%] md:w-[24rem]">إدارة احترافية للمهام والوقت، بين يديك</h1>
        <p className="text-[#757575] w-[90%] md:w-2xl">
        "موقع "وقتي" هو الحل المثالي لتنظيم وإدارة مهامك اليومية بشكل فعال. يساعدك في ترتيب أولوياتك وتحقيق أهدافك بكل سهولة. مع أدواتنا المتقدمة، أصبح إدارة الوقت أكثر سهولة واحترافية.        </p>
      <Link className="bg-[#535FFD] text-white text-2xl px-8 py-2 rounded my-4" href='/signup'>ابدأ الآن</Link>
      </section>
      
      <div className="relative w-full md:w-[70%] mx-auto">
        <Image 
          src={header} 
          alt="home" 
          layout="responsive"
          width={1200}
          height={600}
          className="object-cover"
        />
      </div>
      <Tools/>
    </article>
   </main>
  );
}
