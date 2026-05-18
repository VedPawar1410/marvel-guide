const ACCENTS = [
  { label: 'Marvel Red', v: '#E23636' },
  { label: 'Gold',       v: '#F0B429' },
  { label: 'Arc Blue',   v: '#1E6FD9' },
]

const TYPES = [
  { v: 'all',     l: 'All' },
  { v: 'Movie',   l: 'Movies' },
  { v: 'Series',  l: 'Series' },
  { v: 'Special', l: 'Specials' },
]

function TweaksPanel({ tweaks, setTweak, onClose }) {
  return (
    <div className="twp">
      <div className="twp__hdr">
        <span className="twp__title">Tweaks</span>
        <button className="twp__close" onClick={onClose}>&#215;</button>
      </div>
      <div className="twp__body">
        <div className="twp__sec">
          <div className="twp__lbl">Accent Color</div>
          <div className="twp__colors">
            {ACCENTS.map(a => (
              <button
                key={a.v}
                className={`twp__color${tweaks.accentColor === a.v ? ' twp__color--on' : ''}`}
                style={{ '--c': a.v }}
                onClick={() => setTweak('accentColor', a.v)}
                title={a.label}
              />
            ))}
          </div>
        </div>
        <div className="twp__sec">
          <div className="twp__lbl">Show Type</div>
          <div className="twp__types">
            {TYPES.map(t => (
              <button
                key={t.v}
                className={`twp__typebtn${tweaks.typeFilter === t.v ? ' twp__typebtn--on' : ''}`}
                onClick={() => setTweak('typeFilter', t.v)}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweaksPanel
