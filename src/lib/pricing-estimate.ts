export type PricingInput={monthlyCosts:number;monthlyIncome:number;billableHours:number;projectHours:number;reservePercent:number};
export function estimateProjectPrice(input:PricingInput){
 const {monthlyCosts,monthlyIncome,billableHours,projectHours,reservePercent}=input;
 if(Object.values(input).some(n=>!Number.isFinite(n)) || monthlyCosts<0 || monthlyIncome<0 || billableHours<=0 || projectHours<=0 || reservePercent<0 || reservePercent>=100) return null;
 const hourly=(monthlyCosts+monthlyIncome)/billableHours/(1-reservePercent/100);
 const result={hourly:Math.ceil(hourly*100)/100,project:Math.ceil(hourly*projectHours*100)/100};
 return Number.isFinite(result.hourly) && Number.isFinite(result.project) ? result : null;
}
