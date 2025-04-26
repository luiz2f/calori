export default function Spinner({
  white = false,
  small = false
}: {
  white?: boolean
  small?: boolean
}) {
  return (
    <div
      id='spinner'
      className={`${white ? 'spinnerw' : ''} ${small ? 'spinnersm' : ''}`}
    ></div>
  )
}
