"use client"

import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

import demoMessages from '@/data/messages.json'

export default function Home() {

    return (

        <main
            className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12"
        >
            <section
                className="text-center mb-8 md:mb-12 "
            >
                <h1
                    className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-6"
                >
                    Welcome to world of Anonymous Messaging</h1>

                <p
                    className="font-semibold text-lg md:text-xl"
                >
                    Unmask your thoughts, not your identity.</p>
            </section>

            <Carousel
                plugins={[Autoplay({ delay: 2000 })]}
                className="w-full max-w-xs"
            >
                <CarouselContent>
                    {demoMessages.map((demo, index) => {
                        return (
                            <CarouselItem key={demo.title}>
                                <div className="p-1">
                                    <Card>

                                        <CardHeader>
                                            {demo.title}
                                        </CardHeader>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-lg font-semibold">{demo.content}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>


        </main>

    );
}


/* 

*/