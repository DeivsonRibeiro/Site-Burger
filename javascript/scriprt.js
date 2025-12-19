document.getElementById('calcularFrete').addEventListener('click', async () => {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  const resultado = document.getElementById('resultadoFrete');

  if (cep.length !== 8) {
    resultado.textContent = 'Por favor, digite um CEP válido.';
    return;
  }

  try {
    // Exemplo de API pública de frete (não oficial)
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    // Aqui você usaria uma API real de frete, substituindo a lógica
    // Exemplo fictício de cálculo
    const frete = (Math.floor(Math.random() * 20) + 10); // R$ 10 a R$ 30

    resultado.innerHTML = `
      CEP: ${data.cep} <br>
      Cidade: ${data.localidade} <br>
      Estado: ${data.uf} <br>
      Frete estimado: R$ ${frete},00
    `;
  } catch (error) {
    resultado.textContent = 'Erro ao calcular frete. Tente novamente.';
    console.error(error);
  }
});
