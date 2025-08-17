import { NextResponse } from 'next/server';
import Case from '@/model/Case';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'; // adjust path if needed
import dbConnect from '@/lib/dbConnect'; // make sure you have this helper

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const query: any = { userId: session.user.id };

  const [data, total] = await Promise.all([
    Case.find(query)
      .select('_id title caseNumber status priority court filingDate lastUpdatedAt')
      .sort({ lastUpdatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Case.countDocuments(query),
  ]);

  return NextResponse.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
