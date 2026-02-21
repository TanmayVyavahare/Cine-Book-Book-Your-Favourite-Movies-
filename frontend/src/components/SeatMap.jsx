/**
 * SeatMap.jsx - Seat grid with row labels (A–E), green/red/yellow legend
 */

export default function SeatMap({ seats, selectedSeats, onSeatToggle, disabled }) {
  const getSeatClass = (seat) => {
    if (seat.isBooked) return 'seat booked';
    if (selectedSeats.includes(seat.seatNumber)) return 'seat selected';
    return 'seat available';
  };

  const handleClick = (seat) => {
    if (seat.isBooked || disabled) return;
    onSeatToggle(seat.seatNumber);
  };

  // Group seats by row (A, B, C, D, E)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsByRow = rows.map((row) => ({
    label: row,
    seats: seats.filter((s) => s.seatNumber.startsWith(row)),
  }));

  return (
    <div className="seat-map">
      <div className="screen-label">SCREEN</div>
      <div className="seat-map-rows">
        {seatsByRow.map(
          (r) =>
            r.seats.length > 0 && (
              <div key={r.label} className="seat-row">
                <span className="seat-row-label">{r.label}</span>
                <div className="seat-row-seats">
                  {r.seats.map((seat) => (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      className={getSeatClass(seat)}
                      onClick={() => handleClick(seat)}
                      disabled={seat.isBooked || disabled}
                      title={seat.seatNumber}
                    >
                      {seat.seatNumber.replace(r.label, '')}
                    </button>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
      <div className="seat-legend">
        <span className="legend available">Available</span>
        <span className="legend booked">Booked</span>
        <span className="legend selected">Selected</span>
      </div>
    </div>
  );
}
