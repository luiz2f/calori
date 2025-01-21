import Image from 'next/image'
import logo from '@/public/logo.png'

export default function Logo({ height = 20 }: { height?: number }) {
  return <Image src={logo} alt='Logo' height={height} />
}
