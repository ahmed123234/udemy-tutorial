import Stripe from "stripe";
import { headers } from 'next/headers';
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import db from "@/lib/db";
/**
 * send a post request from the server-side to the client via the callback webhook url
 */
export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;
    
    try { 
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET! // your webhook secret here
        )
    } catch(err: any) {
        console.error(err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 401 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    console.log("meatdata info", userId, courseId);
    

    if(event.type === "checkout.session.completed") {
        if(!userId || !courseId) {
           return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
        }

        const purchase = await db.purchase.create({
            data: {
                courseId,
                userId
            }
        });

        // return NextResponse.json(purchase, { status: 201 });
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}