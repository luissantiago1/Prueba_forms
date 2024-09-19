import { useState, useEffect } from 'react';
import localFont from 'next/font/local';
import Image from 'next/image';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

interface Departamento {
  departamento: string;
  municipio: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    departamento: '',
    ciudad: '',
    celular: '',
    email: '',
    habeasData: false,
  });

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<{ [key: string]: string[] }>({});
  const [codigo, setCodigo] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [alerta, setAlerta] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/departamentos')
      .then(response => response.json())
      .then((departamentosData: Departamento[]) => {
        const departamentosUnicos = Array.from(new Set(departamentosData.map(item => item.departamento)))
          .sort((a, b) => a.localeCompare(b));
        setDepartamentos(departamentosUnicos);

        const ciudadesPorDepartamento = departamentosData.reduce((acc: { [key: string]: string[] }, item: Departamento) => {
          if (!acc[item.departamento]) {
            acc[item.departamento] = [];
          }
          acc[item.departamento].push(item.municipio);
          return acc;
        }, {});
        for (const departamento in ciudadesPorDepartamento) {
          ciudadesPorDepartamento[departamento].sort((a, b) => a.localeCompare(b));
        }
        setCiudades(ciudadesPorDepartamento);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlerta(null);
    const newCodigo = Math.random().toString(36).substring(2, 15);
    setCodigo(newCodigo);
    setShowImage(true);
    setShowMessage(false);

    setTimeout(() => {
      setShowImage(false);
      setShowMessage(true);
    }, 5000);
  };

  const checkValidity = (input: HTMLInputElement) => {
    if (input.validity.patternMismatch) {
      input.setCustomValidity(input.title);
    } else {
      input.setCustomValidity('');
    }
  };

  return (
    <div className={`container ${geistSans.variable} ${geistMono.variable}`}>
      <main className="main">
        {showImage && 
        <div className='text-center form-container'>
          <h2 className="text-2xl text-black">Se esta generando el codigo</h2>
          <p className="mt-4 text-lg text-black">Por favor espere un momento</p>
            <Image src="/car.png" alt="Logo" className="car" width={500} height={220}/> 
        </div>}
        {showMessage && codigo && (
          <div className="text-center form-container">
            <h2 className="text-2xl text-black">Registro completado</h2>
            <p className="mt-4 text-lg text-black">Tu código es: <span className="font-mono">{codigo}</span></p>
            <p className="mt-4 text-lg text-black"><span className="font-mono">Te llegara un correo con el codigo y mas información, gracias por participar.</span></p>
          </div>
        )}
        {!showImage && !showMessage && (
          <form onSubmit={handleSubmit} className="form-container">
            <div className='text-center pb-2'>
              <h1 className='label small'>¡Participa en el Sorteo!</h1>
              <p className='label'>Completa el formulario para participar en el sorteo y ganar un carro. Recibirás un código de participación al finalizar.</p>
            </div>
            {alerta && <div className="alerta">{alerta}</div>}
            <div className="mb-4">
              <label className="label" htmlFor="nombre">Nombre</label>
              <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required pattern="[A-Za-zÁÉÍÓÚáéíóú ]+" title="Ingrese un nombre válido sin caracteres especiales; solo se permiten tildes." className="input-field" onInput={(e) => checkValidity(e.target as HTMLInputElement)} />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="apellido">Apellido</label>
              <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} required pattern="[A-Za-zÁÉÍÓÚáéíóú ]+" title="Ingrese un apellido válido sin caracteres especiales; solo se permiten tildes." className="input-field" onInput={(e) => checkValidity(e.target as HTMLInputElement)} />
            </div>
            <div className="mb-4">
              <label className="label" id='cedula' htmlFor="cedula">Cédula</label>
              <input type="text" name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} required pattern="[0-9]{6,10}" title="Ingrese una cédula válida" className="input-field" onInput={(e) => checkValidity(e.target as HTMLInputElement)} />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="departamento">Departamento</label>
              <select name="departamento" value={formData.departamento} onChange={handleChange} required className="input-field">
                <option value="">Selecciona un departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="ciudad">Ciudad</label>
              <select name="ciudad" value={formData.ciudad} onChange={handleChange} required className="input-field">
                <option value="">Selecciona una ciudad</option>
                {ciudades[formData.departamento]?.map((ciudad) => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="celular">Celular</label>
              <input type="text" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} required pattern="^3[0-9]{9}" title="Ingrese un número de celular válido" className="input-field" onInput={(e) => checkValidity(e.target as HTMLInputElement)} />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="email">Correo Electrónico</label>
              <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} required className="input-field" />
            </div>
            <div className="mb-4">
              <label className="checkbox-label" htmlFor="habeasData">
                <input type="checkbox" name="habeasData" checked={formData.habeasData} onChange={handleChange} required className="checkbox" />
                Autorizo el tratamiento de mis datos de acuerdo con la finalidad establecida en la política de protección de datos personales.
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="button">
                Registrarse
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

