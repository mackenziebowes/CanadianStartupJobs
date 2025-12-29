interface FAQButtonProps {
  open: () => void,
}

export default function FAQButton(props: FAQButtonProps) {
  return (
    <button
      onClick={props.open}
      className="font-mono text-sm text-[#8b2332] cursor-pointer hover:text-[#721c28] transition-colors"
    >
      FAQ
    </button>
  )
}
