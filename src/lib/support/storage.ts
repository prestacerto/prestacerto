import 'server-only';
import {createServiceClient} from '@/lib/supabase/service';
import {randomInt,randomUUID} from 'node:crypto';
const bucketName='sima-prestacerto-support';
let initialized:ReturnType<typeof initializeStore>|undefined;
export async function supportStore(){
 if(!initialized)initialized=initializeStore().catch(error=>{initialized=undefined;throw error});
 return initialized;
}
async function initializeStore(){
 const client=createServiceClient();const {data,error}=await client.storage.getBucket(bucketName);
 if(error){const created=await client.storage.createBucket(bucketName,{public:false,fileSizeLimit:64000,allowedMimeTypes:['application/json']});if(created.error){const recheck=await client.storage.getBucket(bucketName);if(recheck.error||recheck.data.public)throw new Error('storage')}}else if(data.public)throw new Error('storage');
 return client.storage.from(bucketName);
}
// Immutable object names act as atomic reservations across server instances.
// Only the server credential can access the private bucket. Conservative
// collisions may reject before the cap; they never allow exceeding the cap.
export async function reserveSupport(ipHash:string){
 const store=await supportStore(),day=new Date().toISOString().slice(0,10),minute=Math.floor(Date.now()/60000);
 async function reserve(prefix:string,slots:number){const {error}=await store.upload(`${prefix}/${randomInt(slots)}.json`,'{}',{contentType:'application/json',upsert:false});if(!error)return true;if(String(error.statusCode)==='429'||/already exists|duplicate/i.test(error.message))return false;console.info(JSON.stringify({event:'support_reservation_error',code:error.name,status:error.statusCode}));throw new Error('storage')}
 if(!await reserve(`limits/${day}/ip/${ipHash}/${minute}`,15))return false;
 return reserve(`limits/${day}/budget`,1000);
}
export async function recordSupport(data:Record<string,unknown>){const store=await supportStore();const {error}=await store.upload(`conversations/${new Date().toISOString().slice(0,10)}/${randomUUID()}.json`,JSON.stringify({...data,tenant:'prestacerto',created_at:new Date().toISOString()}),{contentType:'application/json',upsert:false});if(error)throw new Error('storage')}
