import {handleEngine} from '@/lib/sima-engine/core';
import {engineCredentials} from '@/lib/sima-engine/credentials';
import {engineStore} from '@/lib/sima-engine/store';
import {generateAnswer} from '@/lib/sima-engine/provider';
export const runtime='nodejs';
export const maxDuration=30;
export async function POST(request:Request){return handleEngine(request,'production',{credentials:engineCredentials(),store:engineStore,generate:generateAnswer})}
