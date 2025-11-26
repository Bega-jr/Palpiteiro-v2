import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  session: Session | null
  user: User | null
  isVip: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isVip, setIsVip] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) checkVipStatus(session.user.id)
      setLoading(false)
    })

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        checkVipStatus(session.user.id)
      } else {
        setIsVip(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkVipStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_vip')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = linha não encontrada
        console.error('Erro ao verificar VIP:', error)
      } else {
        setIsVip(data?.is_vip || false)
      }
    } catch (err) {
      console.error('Erro inesperado ao verificar VIP:', err)
      setIsVip(false)
    }
  }

  // LOGIN COM GOOGLE — RESOLVIDO redirect_uri_mismatch
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://palpiteirov2.netlify.app/' // URL EXATA CADASTRADA NO SUPABASE
      }
    })

    if (error) {
      console.error('Erro no login com Google:', error)
      toast.error('Erro ao fazer login com Google')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erro ao sair')
    } else {
      toast.success('Deslogado com sucesso!')
      setIsVip(false)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, isVip, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}