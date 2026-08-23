'use client';

import { useState } from 'react';
import { ChevronLeft, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SellPage() {
  const [step, setStep] = useState<'list' | 'payment'>('list');
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    price: '',
    description: '',
  });
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isHighlighted) {
      setStep('payment');
      setPaymentStatus('processing');
      // Simular pagamento
      setTimeout(() => {
        setPaymentStatus('completed');
      }, 2000);
    } else {
      // Listar direto sem pagamento
      alert('Veículo listado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-2 hover:bg-gray-50 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Vender Veículo</h1>
            <p className="text-xs text-gray-500">Anuncie seu carro em poucos minutos</p>
          </div>
        </div>
      </header>

      {step === 'list' ? (
        <main className="px-4 py-4">
          {/* Form Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={vehicleData.brand}
                onChange={handleInputChange}
                placeholder="Ex: VOLKSWAGEN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleInputChange}
                placeholder="Ex: T-CROSS"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ano
                </label>
                <select
                  name="year"
                  value={vehicleData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  KM
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={vehicleData.mileage}
                  onChange={handleInputChange}
                  placeholder="Ex: 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                name="price"
                value={vehicleData.price}
                onChange={handleInputChange}
                placeholder="Ex: 161690"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={vehicleData.description}
                onChange={handleInputChange}
                placeholder="Descreva o estado do veículo, histórico, etc"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 cursor-pointer transition">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Clique para adicionar fotos</p>
              <p className="text-xs text-gray-500">ou arraste as imagens aqui</p>
            </div>
          </div>

          {/* Highlight Option */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="highlight"
                checked={isHighlighted}
                onChange={(e) => setIsHighlighted(e.target.checked)}
                className="mt-1 w-5 h-5 accent-yellow-500 cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="highlight" className="font-semibold text-gray-900 block cursor-pointer">
                  ⭐ Destacar meu anúncio
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Apareça em primeiro lugar nas buscas por apenas
                </p>
                <p className="text-lg font-bold text-yellow-600 mt-1">
                  R$ 39,90
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Válido por 30 dias com até 3 renovações automáticas
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {isHighlighted ? 'Continuar para Pagamento' : 'Listar Agora'}
          </button>
        </main>
      ) : (
        <main className="px-4 py-4">
          {/* Payment Section */}
          <div className="max-w-md mx-auto py-8">
            {paymentStatus === 'processing' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Processando pagamento...</h2>
                <p className="text-gray-600">Aguarde um momento enquanto processamos sua transação</p>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pagamento Confirmado!</h2>
                <p className="text-gray-600">Seu anúncio foi listado com sucesso e está em destaque</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 mt-6">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Seu anúncio aparecerá em primeiro lugar nas buscas por 30 dias
                </div>

                <Link
                  href="/"
                  className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition mt-6"
                >
                  Voltar para Início
                </Link>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
