'use client';

export function BrandGrid() {
  const brands = [
    'CHEVROLET',
    'CITROËN',
    'FIAT',
    'FORD',
    'HONDA',
    'HYUNDAI',
    'MITSUBISHI',
    'NISSAN',
    'PEUGEOT',
    'RENAULT',
    'TOYOTA',
    'VOLKSWAGEN',
    'VOLVO',
    'BMW',
    'AUDI',
    'MERCEDES'
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {brands.map((brand) => (
        <button
          key={brand}
          className="border border-gray-300 rounded-lg py-3 px-2 font-semibold text-gray-700 hover:border-red-500 hover:text-red-500 transition"
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
