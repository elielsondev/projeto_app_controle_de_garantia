import React from 'react';
import '../style/Home.css'; // Importa o arquivo CSS

// Componente para o card de resumo (Total, Vencendo, Ativas, Vencidas)
const CardResumo = ({ title, value, icon, statusClass }) => (
  <div className={`card-resumo ${statusClass}`}>
    <span className="card-value">{value}</span>
    <span className="card-title">{title}</span>
    <span className="card-icon">{icon}</span>
  </div>
);

// Componente para o item de nota (Compras de Ventiladores)
const NotaItem = ({ nota }) => (
  <div className="nota-item">
    <div className="nota-header">
      <h3 className="nota-titulo">{nota.titulo}</h3>
      <p className="nota-fornecedor">{nota.fornecedor}</p>
    </div>
    
    <div className="nota-detalhes">
      <p>Compra: {nota.compraData}</p>
      <p>Tipo de nota: {nota.tipoNota}</p>
    </div>
    
    <div className="nota-footer">
      <span className="nota-valor">R$ {nota.valor.toFixed(2).replace('.', ',')}</span>
      <span className={`nota-status status-${nota.status.toLowerCase().replace(' ', '-')}`}>{nota.status}</span>
    </div>
  </div>
);


const Home = () => {
  // Dados de exemplo (Mock data)
  const dadosResumo = [
    { title: 'Total', value: 12, icon: '📄', statusClass: 'total' },
    { title: 'Vencendo', value: 3, icon: '⏰', statusClass: 'vencendo' },
    { title: 'Ativas', value: 12, icon: '✅', statusClass: 'ativas' },
    { title: 'Vencidas', value: 3, icon: '⚠️', statusClass: 'vencidas' },
  ];

  const notas = [
    {
      id: 1,
      titulo: 'Monitor Dell',
      fornecedor: 'Magazine Luiza',
      compraData: '12/02/2025',
      tipoNota: 'Garantia Normal',
      valor: 1000.00,
      status: 'Em garantia',
    },
    {
      id: 2,
      titulo: 'Teclado Dell',
      fornecedor: 'Magazine Luiza',
      compraData: '12/02/2025',
      tipoNota: 'Garantia Estendida',
      valor: 1000.00,
      status: 'Vencida',
    },
    {
      id: 3,
      titulo: 'Mouse Dell',
      fornecedor: 'Magazine Luiza',
      compraData: '12/02/2025',
      tipoNota: 'Garantia Estendida',
      valor: 1000.00,
      status: 'Em garantia',
    },
    // Adicione mais notas aqui...
  ];

  return (
    <div className="tela-inicial-container">
      {/* Barra Superior */}
      <header className="header-bar">
        <button className="menu-button">☰</button>
        <button className="profile-button">👤</button>
      </header>

      {/* Seção de Pesquisa */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <input type="text" placeholder="Pesquisar Notas" className="search-input" />
          <span className="search-icon">🔍</span>
          <button className="filter-button">🎚️</button>
        </div>
      </div>
      
      {/* Cards de Resumo */}
      <div className="resumo-cards-grid">
        {dadosResumo.map((card, index) => (
          <CardResumo key={index} {...card} />
        ))}
      </div>

      {/* Lista de Notas */}
      <div className="notas-list">
        {notas.map((nota) => (
          <NotaItem key={nota.id} nota={nota} />
        ))}
      </div>

      {/* Botão de Ação Flutuante */}
      <button className="fab-button">+</button>
    </div>
  );
};

export default Home;