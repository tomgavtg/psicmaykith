import Link from "next/link";

export function Breadcrumbs({ current }) {
  return (
    <nav className="breadcrumbs" aria-label="Migas de pan">
      <Link href="/">Inicio</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
