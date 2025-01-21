export default function DietName({ name }: { name: string }) {
  return (
    <div className='flex px-5 py-3 border-b-1 border-lightgreen shadow-dt'>
      <div className='font-medium w-full text-xl'>{name}</div>
    </div>
  )
}
