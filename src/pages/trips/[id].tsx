import React, { useState } from 'react'
import SplitLayout from '../../components/splitLayout'
import Itinerary from '../../components/itinerary'
import Map from '../../components/map'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import { GrView } from 'react-icons/gr'

interface IActivity {
  city: string
  contactInfo: string
  country: string
  endTime: Date
  id: number
  name: string
  note: string
  photo: string | null
  postalCode: string
  startTime: Date
  street: string
  tripDayId: number
}
interface ITripDay {
  activities: IActivity[] | []
  date: Date
  id: number
  itineraryId: number
}

interface IItineraryData {
  coverPhoto?: string
  destinations: string[]
  endDate: Date
  id: number
  likes: number
  name: string
  public: boolean
  profileId: number
  startDate: Date
  tripDays: ITripDay[]
}


const tripPage = (itineraryData: IItineraryData) => {
  const [viewState, setViewState] = useState(false)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
      <div className={`${viewState && 'hidden'} lg:block 2xl:col-start-1 2xl:col-end-1`}>
        <Itinerary itin={itineraryData} />
      </div>
      <div className={`${!viewState && 'hidden'} lg:block 2xl:col-start-2 2xl:col-end-4`}>
        <Map />
      </div>

      <button onClick={() => setViewState((prev) => !prev)} className='lg:hidden fixed bottom-4 right-4 px-2 py-2 text-sm transition-colors duration-300 rounded-full shadow-xl text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-500'>{<GrView size={30} />}</button>
    </div>
  )
}

export default tripPage

export const getServerSideProps: GetServerSideProps = async ({query}) => {

  let itineraryData;

  try {           
    const data = await prisma.itinerary.findUnique({
      where: {
        id: Number(query.id),
      },
      include: {
        tripDays: {
          include: {
            activities: true,
          }
        }
      }
    });
    itineraryData = data;


  } catch (e) {
    console.error(e);
  }
  return { 
    props: JSON.parse(JSON.stringify(itineraryData)) 
  }
  
  // if no itineraries found, redirect to plan?
}