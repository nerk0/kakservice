'use client'

import { useEffect } from 'react'
import { useCart } from '@/hooks/useCart'

export function CartInitializer({ teamId }: { teamId: string }) {
  const { teamId: currentTeamId, setTeamId } = useCart()

  useEffect(() => {
    if (currentTeamId !== teamId) {
      setTeamId(teamId)
    }
  }, [teamId, currentTeamId, setTeamId])

  return null
}
