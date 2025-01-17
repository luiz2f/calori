'use client'
import React, { useContext, useEffect, useState } from 'react'
import Toogle from '@/components/ui/Toogle'
import { useMacroContext } from '@/app/context/useMacroContext'
import { useWeight } from '@/app/data/user/useWeight'
import { ModalContext } from '@/components/ui/Modal'

export default function DietMacros() {
  const [currentMetric, setCurrentMetric] = useState<'g/KG' | 'g' | '% kcal'>(
    'g'
  )
  const [data, setData] = useState({
    'g/KG': {
      carb: 0,
      prot: 0,
      fat: 0
    },
    g: {
      carb: 0,
      prot: 0,
      fat: 0
    },
    '% kcal': {
      carb: '0%',
      prot: '0%',
      fat: '0%'
    },
    totalKcal: 0
  })
  const { open } = useContext(ModalContext)
  const { totalMacros } = useMacroContext()
  const { data: wg } = useWeight()
  const weight = wg || 1
  const noWeight = !wg && currentMetric === 'g/KG'

  const openSetWeight = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    open('my-weight-false')
  }

  useEffect(() => {
    const totalKcal =
      totalMacros.carb * 4 + totalMacros.prot * 4 + totalMacros.fat * 9

    const setMacroPercent = (macro: number) => {
      return !isNaN(((macro * 4) / totalKcal) * 100)
        ? `${(((macro * 4) / totalKcal) * 100).toFixed(0)}%`
        : '0%'
    }
    const setMacroPerWeight = (macro: number) => {
      return parseFloat((macro / weight).toFixed(1))
    }
    const newData = {
      'g/KG': {
        carb: setMacroPerWeight(totalMacros.carb),
        prot: setMacroPerWeight(totalMacros.prot),
        fat: setMacroPerWeight(totalMacros.fat)
      },
      g: {
        carb: totalMacros.carb,
        prot: totalMacros.prot,
        fat: totalMacros.fat
      },
      '% kcal': {
        carb: setMacroPercent(totalMacros.carb),
        prot: setMacroPercent(totalMacros.prot),
        fat: setMacroPercent(totalMacros.fat)
      },
      totalKcal: totalKcal
    }

    setData(prevData => {
      if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
        return newData
      }
      return prevData
    })
  }, [totalMacros, weight])

  return (
    <div className='flex flex-col w-full p-4'>
      <div className='flex w-full justify-between'>
        <div className='flex items-center w-fit mx-auto '>
          <Toogle
            options={['g/KG', 'g', '% kcal']}
            value={currentMetric}
            onChange={value =>
              setCurrentMetric(value as 'g/KG' | 'g' | '% kcal')
            }
            className='mt-2'
          />
        </div>
      </div>
      <div className='w-full h-fit py-8'>
        <div className='grid grid-cols-3 max-w-64 m-auto'>
          <div className='flex flex-col align-middle text-center'>
            <div className='text-2xl mb-1'>🍞</div>
            <div>Carboidrato</div>
            <div className='text-2xl text-darkgreen'>
              {data[currentMetric].carb}
            </div>
          </div>
          <div className='flex flex-col align-middle text-center'>
            <div className='text-2xl mb-1'>🥩</div>
            <div>Proteína</div>
            <div className='text-2xl text-darkgreen border-x-1 border-grey10 relative'>
              {data[currentMetric].prot}
              {noWeight ? (
                <div
                  onClick={e => openSetWeight(e)}
                  className='absolute pb-1 top-0 left-1/2 right-0 text-xl -translate-x-1/2 text-center w-max bg-white underline cursor-pointer underline-offset-2'
                >
                  Informe seu peso para visualizar
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className='flex flex-col align-middle text-center'>
            <div className='text-2xl mb-1'>🥑</div>
            <div>Gordura</div>
            <div className='text-2xl text-darkgreen'>
              {data[currentMetric].fat}
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center '>
        <div className='flex w-full bg-grey10 h-[1px]'></div>

        <div className=' w-full flex justify-between flex-col text-center'>
          <div className='leading-[8px]'>Total</div>
          <div className='font-black text-4xl'>{data.totalKcal}</div>
          <div className='leading-[8px]'>kcal</div>
        </div>
        <div className='flex w-full bg-grey10 h-[1px]'></div>
      </div>
    </div>
  )
}
