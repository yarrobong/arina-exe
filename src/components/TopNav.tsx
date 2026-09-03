const items = [
  ['#childhood', 'детство'],
  ['#geography', 'карта'],
  ['#school-5-9', 'школа'],
  ['#evolution', 'версии'],
  ['#university', 'УрФУ'],
  ['#friends', 'люди'],
  ['#relationship', 'Ярик'],
  ['#facts', 'цифры'],
  ['#inventory', 'инвентарь'],
  ['#future', 'будущее'],
]

export function TopNav() {
  return (
    <nav className="top-nav" aria-label="Навигация по истории">
      <div className="top-nav__track">
        {items.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </div>
    </nav>
  )
}
