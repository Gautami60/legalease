import { NextResponse } from 'next/server';
import Case from '@/model/Case';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doc = await Case.findOne({ _id: params.id, userId: session.user.id }).lean();
  if (!doc) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  return NextResponse.json(doc);
}
