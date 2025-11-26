const [apostasDoDia, setApostasDoDia] = useState<any>(null)
const [dataCache, setDataCache] = useState<string>('')

const handleGenerate = async () => {
  setIsGenerating(true)

  try {
    const response = await fetch('https://palpiteiro-v2-backend.onrender.com/api/palpites')
    const data = await response.json()

    if (isVip) {
      // VIP: gera novos toda vez
      setApostas(data.apostas)
      setFixos(data.fixos || [])
    } else {
      // Não-VIP: só atualiza se for um novo dia
      const hoje = new Date().toISOString().split('T')[0]
      if (dataCache !== hoje || !apostasDoDia) {
        setApostas(data.apostas)
        setFixos(data.fixos || [])
        setApostasDoDia(data.apostas)
        setDataCache(hoje)
      }
      // Se já gerou hoje, mantém os mesmos
    }
  } catch (err) {
    toast.error('Erro ao gerar palpites')
  } finally {
    setIsGenerating(false)
  }
}

// Gera automaticamente ao carregar
useEffect(() => {
  handleGenerate()
}, [])