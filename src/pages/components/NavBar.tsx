import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IoMdMenu } from "react-icons/io";

const NavBar = () => {
  const [width, setWidth] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="nav">
      <div className="logo">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={width < 1024 ? 150 : 250}
            height={width < 1024 ? 45 : 74}
            className="relative"
          />
        </Link>
      </div>
      <ul className={`menu ${menuOpen ? 'open' : ''}`}>
        <li><Link href="/">Inicio</Link></li>
        <li><Link href="/empresa">Empresa</Link></li>
        <li><Link href="/productos">Productos</Link></li>
        <li><Link href="/blog">Blog</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
      <div className="auth">
        <Link href="/login">Login</Link>
        <Link href="/comenzar">Comenzar</Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <IoMdMenu />
      </div>
    </nav>
  );
};

export default NavBar;
