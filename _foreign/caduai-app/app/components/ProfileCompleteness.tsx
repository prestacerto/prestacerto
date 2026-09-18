'use client';
import { useState } from 'react';

export default function ProfileCompleteness() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Foto de perfil', done: true, points: 10 },
    { id: 2, name: 'Bio profissional', done: true, points: 15 },
    { id: 3, name: 'Portfólio (min 3 fotos)', done: false, points: 20 },
    { id: 4, name: 'Serviços oferecidos', done: false, points: 15 },
    { id: 5, name: 'Preço ou faixa de preço', done: false, points: 20 },
    { id: 6, name: 'Disponibilidade', done: false, points: 10 },
  ]);

  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const completeness = Math.round((completed / total) * 100);
  const totalPoints = tasks.reduce((acc, t) => acc + (t.done ? t.points : 0), 0);
  const maxPoints = tasks.reduce((acc, t) => acc + t.points, 0);

  return (
    <>
      <style>{`
        .completeness-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .completeness-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .completeness-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #1d174f;
        }
        .completeness-meter {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .completeness-bar {
          width: 100px;
          height: 6px;
          background: #ece9e4;
          border-radius: 3px;
          overflow: hidden;
        }
        .completeness-fill {
          height: 100%;
          background: linear-gradient(90deg, #1f9b62, #17b26a);
          width: ${completeness}%;
          transition: width 0.3s ease-out;
        }
        .completeness-percent {
          font-size: 14px;
          font-weight: 700;
          color: #1f9b62;
          min-width: 40px;
        }
        .tasks-list {
          display: grid;
          gap: 10px;
        }
        .task-item {
          display: grid;
          grid-template-columns: 24px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #f9f7f3;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .task-item:hover {
          background: #f0ebe5;
        }
        .task-item.done {
          opacity: 0.6;
        }
        .task-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #ece9e4;
          border-radius: 4px;
          display: grid;
          place-items: center;
          font-size: 12px;
        }
        .task-item.done .task-checkbox {
          background: #1f9b62;
          border-color: #1f9b62;
          color: white;
        }
        .task-name {
          font-size: 13px;
          font-weight: 600;
          color: #1d174f;
          margin: 0;
        }
        .task-points {
          font-size: 11px;
          background: #ffe1da;
          color: #c4572f;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 700;
        }
      `}</style>

      <div className="completeness-card">
        <div className="completeness-header">
          <h3>📊 Seu Perfil está {completeness}% Completo</h3>
          <div className="completeness-meter">
            <div className="completeness-bar">
              <div className="completeness-fill" />
            </div>
            <span className="completeness-percent">{completeness}%</span>
          </div>
        </div>

        <div className="tasks-list">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`task-item ${task.done ? 'done' : ''}`}
              onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))}
            >
              <div className="task-checkbox">{task.done ? '✓' : ''}</div>
              <p className="task-name">{task.name}</p>
              <span className="task-points">+{task.points} pts</span>
            </div>
          ))}
        </div>

        <div style={{marginTop: 16, padding: '12px', background: '#e8f5f0', borderRadius: 8, textAlign: 'center'}}>
          <small style={{color: '#1f9b62', fontWeight: 700}}>
            🏆 {totalPoints}/{maxPoints} Pontos • Ganhe melhor visibilidade!
          </small>
        </div>
      </div>
    </>
  );
}
