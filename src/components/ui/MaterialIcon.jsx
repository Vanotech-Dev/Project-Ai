/**
 * MaterialIcon - Wrapper for Google Material Symbols Outlined
 * @param {string} icon - Material symbol name
 * @param {string} className - Additional CSS classes
 * @param {boolean} filled - Whether to use filled variant
 * @param {object} props - Additional props
 */
export default function MaterialIcon({ icon, className = '', filled = false, ...props }) {
  const fillSetting = filled
    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: fillSetting }}
      data-icon={icon}
      {...props}
    >
      {icon}
    </span>
  )
}
