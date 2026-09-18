'use client';
export default function ProposalComparator() {
  const proposals = [
    { name: 'João Silva', price: 'R$ 8.000', deadline: '14 dias', includes: ['Design', 'Dev', 'Deploy'], rating: 4.9 },
    { name: 'Maria Santos', price: 'R$ 6.500', deadline: '21 dias', includes: ['Design', 'Dev'], rating: 4.8 },
    { name: 'Carlos Oliveira', price: 'R$ 7.000', deadline: '10 dias', includes: ['Design', 'Dev', 'Deploy', 'Suporte'], rating: 4.7 },
  ];

  return (
    <>
      <style>{`
        .comparator { max-width: 100%; overflow-x: auto; margin: 40px 0; }
        .comparator-table { width: 100%; border-collapse: collapse; }
        .comparator-table th { background: #f9f7f3; padding: 12px; text-align: left; font-size: 11px; font-weight: 700; color: #5d5969; border-bottom: 2px solid #ece9e4; }
        .comparator-table td { padding: 12px; border-bottom: 1px solid #ece9e4; font-size: 12px; }
        .comparator-table tr:hover { background: #f9f7f3; }
        .proposal-name { font-weight: 700; color: #1d174f; }
        .proposal-price { color: #ef4b31; font-weight: 700; font-size: 14px; }
        .proposal-includes { font-size: 11px; color: #a8a3b5; }
        .proposal-rating { color: #ffc107; font-weight: 700; }
        .proposal-button { background: #ef4b31; color: white; border: 0; padding: 8px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; }
      `}</style>

      <div className="comparator" style={{padding: '0 40px'}}>
        <h2 style={{margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: '#1d174f'}}>📊 Comparador de Propostas</h2>
        
        <table className="comparator-table">
          <thead>
            <tr>
              <th>Prestador</th>
              <th>Preço</th>
              <th>Prazo</th>
              <th>Incluso</th>
              <th>Avaliação</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p, i) => (
              <tr key={i}>
                <td className="proposal-name">{p.name}</td>
                <td className="proposal-price">{p.price}</td>
                <td>{p.deadline}</td>
                <td className="proposal-includes">{p.includes.join(' • ')}</td>
                <td className="proposal-rating">⭐ {p.rating}</td>
                <td><button className="proposal-button">Escolher</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
