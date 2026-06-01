import { useState } from 'react';
import { Calculator, Beaker, Droplet } from 'lucide-react';

interface Peptide {
  name: string;
  vialSize: number; // in mg
  commonDosage: number; // in mcg or mg
  dosageUnit: string;
  commonBAC: number; // in ml
  frequency: string;
}

const peptideDatabase: Peptide[] = [
  { name: 'AOD-9604', vialSize: 5, commonDosage: 300, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily' },
  { name: 'BPC-157', vialSize: 10, commonDosage: 250, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Twice daily' },
  { name: 'BPC-157/TB-500 Blend', vialSize: 10, commonDosage: 250, dosageUnit: 'mcg each', commonBAC: 2, frequency: 'Daily' },
  { name: 'CJC-1295 NO DAC', vialSize: 10, commonDosage: 100, dosageUnit: 'mcg', commonBAC: 2, frequency: '1-2x daily' },
  { name: 'CJC-1295/Ipamorelin', vialSize: 5, commonDosage: 200, dosageUnit: 'mcg total', commonBAC: 2, frequency: 'Daily before bed' },
  { name: 'CJC-1295/RTA', vialSize: 10, commonDosage: 200, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily' },
  { name: 'GHK-CU', vialSize: 100, commonDosage: 1, dosageUnit: 'mg', commonBAC: 3, frequency: 'Daily' },
  { name: 'GLP-3 (Retatrutide)', vialSize: 10, commonDosage: 500, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Week 1: 0.5mg, Week 2: 1mg, Week 3: 1.5mg, Week 4+: 2mg' },
  { name: 'GLOW Blend', vialSize: 5, commonDosage: 250, dosageUnit: 'mcg', commonBAC: 2.5, frequency: 'Daily' },
  { name: 'IGF-1 LR3', vialSize: 1, commonDosage: 40, dosageUnit: 'mcg', commonBAC: 1, frequency: 'Daily post-workout' },
  { name: 'Ipamorelin', vialSize: 10, commonDosage: 200, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily before bed' },
  { name: 'KLOW', vialSize: 10, commonDosage: 250, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily' },
  { name: 'MOTS-C', vialSize: 10, commonDosage: 5, dosageUnit: 'mg', commonBAC: 2, frequency: '2x weekly' },
  { name: 'TB-500', vialSize: 10, commonDosage: 250, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily' },
  { name: 'Tesamorelin', vialSize: 10, commonDosage: 500, dosageUnit: 'mcg', commonBAC: 2, frequency: 'Daily' },
  { name: 'Tesamorelin/Ipamorelin', vialSize: 10, commonDosage: 500, dosageUnit: 'mcg each', commonBAC: 2, frequency: 'Daily' },
  { name: 'L-Carnitine', vialSize: 1000, commonDosage: 250, dosageUnit: 'mg', commonBAC: 3, frequency: '3x weekly' },
  { name: 'NAD+', vialSize: 500, commonDosage: 50, dosageUnit: 'mg', commonBAC: 5, frequency: '2-3x weekly' },
];

export default function App() {
  const [selectedPeptide, setSelectedPeptide] = useState<Peptide | null>(null);

  // Custom calculator states
  const [customMG, setCustomMG] = useState('');
  const [customBAC, setCustomBAC] = useState('');
  const [customDose, setCustomDose] = useState('');
  const [customUnit, setCustomUnit] = useState('mcg');

  const calculateInjectionVolume = (vialMG: number, bacML: number, doseMCG: number, unit: string) => {
    const vialMCG = unit === 'mg' ? vialMG : vialMG * 1000;
    const dosageInMCG = unit === 'mg' ? doseMCG * 1000 : doseMCG;
    const concentration = vialMCG / bacML; // mcg per mL
    const volumeML = dosageInMCG / concentration;
    const volumeUnits = volumeML * 100; // Convert to units on U100 syringe
    return { volumeML: volumeML.toFixed(3), volumeUnits: volumeUnits.toFixed(2) };
  };

  const standardResult = selectedPeptide
    ? calculateInjectionVolume(
        selectedPeptide.vialSize,
        selectedPeptide.commonBAC,
        selectedPeptide.commonDosage,
        selectedPeptide.dosageUnit
      )
    : null;

  const customResult = customMG && customBAC && customDose
    ? calculateInjectionVolume(
        parseFloat(customMG),
        parseFloat(customBAC),
        parseFloat(customDose),
        customUnit
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Beaker className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Peptide Dosage Calculator</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate precise dosages for your peptide therapy. Select from our standard protocols or create custom calculations.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Standard Calculator */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Standard Dosage</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Peptide
                </label>
                <select
                  value={selectedPeptide?.name || ''}
                  onChange={(e) => {
                    const peptide = peptideDatabase.find(p => p.name === e.target.value);
                    setSelectedPeptide(peptide || null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Choose a peptide...</option>
                  {peptideDatabase.map((peptide) => (
                    <option key={peptide.name} value={peptide.name}>
                      {peptide.name} - {peptide.vialSize}{peptide.vialSize >= 100 ? 'mg' : 'mg'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPeptide && (
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Vial Size</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedPeptide.vialSize} mg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Standard BAC</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedPeptide.commonBAC} mL</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Common Dosage</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedPeptide.commonDosage} {selectedPeptide.dosageUnit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedPeptide.frequency}</p>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 pt-4 mt-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Draw Amount (U100 Syringe)</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-blue-600">
                          {standardResult?.volumeUnits}
                        </span>
                        <span className="text-lg text-gray-600">units</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        = {standardResult?.volumeML} mL
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedPeptide && (
                <div className="text-center py-12 text-gray-400">
                  <Droplet className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>Select a peptide to see dosage information</p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Calculator */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Custom Calculator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vial Strength (mg)
                </label>
                <input
                  type="number"
                  value={customMG}
                  onChange={(e) => setCustomMG(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BAC Water Added (mL)
                </label>
                <input
                  type="number"
                  value={customBAC}
                  onChange={(e) => setCustomBAC(e.target.value)}
                  placeholder="e.g., 2"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Dose
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customDose}
                    onChange={(e) => setCustomDose(e.target.value)}
                    placeholder="e.g., 250"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                  </select>
                </div>
              </div>

              {customResult && (
                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Draw Amount (U100 Syringe)</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-indigo-600">
                        {customResult.volumeUnits}
                      </span>
                      <span className="text-lg text-gray-600">units</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      = {customResult.volumeML} mL
                    </p>
                  </div>

                  <div className="mt-4 text-xs text-gray-600 bg-white rounded p-3">
                    <p className="font-medium mb-1">Calculation:</p>
                    <p>Concentration: {((parseFloat(customMG) / parseFloat(customBAC)) * (customUnit === 'mg' ? 1 : 1000)).toFixed(0)} {customUnit}/mL</p>
                  </div>
                </div>
              )}

              {!customResult && (
                <div className="text-center py-12 text-gray-400">
                  <Calculator className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p>Fill in all fields to calculate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p className="text-sm text-amber-900">
            <strong>Disclaimer:</strong> These calculations are for informational purposes only. Dosages shown are commonly used reference amounts and are not medical advice. Always consult with a qualified healthcare provider before starting any peptide therapy. Individual dosing may vary based on specific health conditions and goals.
          </p>
        </div>
      </div>
    </div>
  );
}
