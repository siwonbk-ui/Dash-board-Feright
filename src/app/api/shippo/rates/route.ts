import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.SHIPPO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Shippo API key is missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { from_zip, to_zip, from_country, to_country, weight, length, width, height } = body;

    // Create a shipment to get rates
    // https://goshippo.com/docs/rates
    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address_from: {
          zip: from_zip,
          country: from_country || 'US',
        },
        address_to: {
          zip: to_zip,
          country: to_country || 'US',
        },
        parcels: [{
          length: length || "5",
          width: width || "5",
          height: height || "5",
          distance_unit: "in",
          weight: weight || "1",
          mass_unit: "lb",
        }],
        async: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Failed to fetch rates from Shippo' }, { status: response.status });
    }

    const data = await response.json();
    
    // Sort rates by price (amount)
    const sortedRates = (data.rates || []).sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount));

    return NextResponse.json({
      shipment_id: data.object_id,
      rates: sortedRates.map((rate: any) => ({
        id: rate.object_id,
        carrier: rate.provider,
        service: rate.servicelevel.name,
        price: rate.amount,
        currency: rate.currency,
        estimated_days: rate.estimated_days,
        provider_image: rate.provider_image_75,
      })),
    });
  } catch (error) {
    console.error('Shippo API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
