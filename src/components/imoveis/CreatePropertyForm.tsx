'use client';

import { useState } from 'react';
import { Upload, Check } from 'lucide-react';

export default function CreatePropertyForm() {
  const [formData, setFormData] = useState({
    type: 'apartamento',
    title: '',
    description: '',
    price: '',
    priceRent: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    neighborhood: '',
    zipCode: '',
    features: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const featureOptions = [
    'Ar condicionado',
    'Piscina',
    'Academia',
    'Portaria 24h',
    'Garagem',
    'Varanda',
    'Closet',
    'Churrasqueira',
  ];

  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form data:', { ...formData, images });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-8">
      {/* Type Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">Tipo de Imóvel</h3>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-600"
        >
          <option value="apartamento">Apartamento</option>
          <option value="casa">Casa</option>
          <option value="cobertura">Cobertura</option>
          <option value="terreno">Terreno</option>
          <option value="kitinete">Kitinete</option>
        </select>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-xl font-bold mb-4">Informações Básicas</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Título do anúncio"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descrição completa do imóvel"
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-xl font-bold mb-4">Preços</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Preço de venda"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
          <input
            type="number"
            name="priceRent"
            value={formData.priceRent}
            onChange={handleInputChange}
            placeholder="Preço de aluguel (mensal)"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-xl font-bold mb-4">Detalhes do Imóvel</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            placeholder="Quartos"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            placeholder="Banheiros"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="Área (m²)"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-xl font-bold mb-4">Localização</h3>
        <div className="space-y-4">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Endereço"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              placeholder="Bairro"
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Cidade"
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
            />
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="CEP"
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xl font-bold mb-4">Características</h3>
        <div className="grid grid-cols-2 gap-3">
          {featureOptions.map((feature) => (
            <label key={feature} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-xl font-bold mb-4">Fotos</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-600 transition">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-700 font-semibold mb-1">Clique para fazer upload</p>
            <p className="text-gray-500 text-sm">ou arraste as fotos aqui</p>
            {images.length > 0 && (
              <p className="text-blue-600 mt-2 font-semibold">{images.length} foto(s) selecionada(s)</p>
            )}
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Publicar Imóvel
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition"
        >
          Salvar Rascunho
        </button>
      </div>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          ✓ Imóvel publicado com sucesso! Agora apareça nos resultados de busca.
        </div>
      )}
    </form>
  );
}
