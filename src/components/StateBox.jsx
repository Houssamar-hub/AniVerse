function StatBox({ state }) {
    return (
        <div className="stat-box" style={{ minWidth: "110px",textAlign:"center" }}>
            <div className="bebas" style={{ fontSize: "36px", color: "var(--amber)", lineHeight: 1 }}>
                {state.value}
            </div>
            <div className="mono" style={{
                fontSize: "9px",
                color: "var(--fog)",
                letterSpacing: "2px",
                marginTop: "4px"
            }}>
                {state.label}
            </div>
        </div>
    )
}

export default StatBox
