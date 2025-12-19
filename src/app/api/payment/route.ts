
import { DocumentData, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";
import { DB } from "@/service/firebase";

export async function POST(req : Request, response : Response, head : Headers) {
  console.log("====> Payment Prod");
  
    try {
        
      const body = await req.json();

      console.log(body);
      console.log("====> Read Body");
      
      const refBill = doc(DB, "Billing/" + body.order_id);
      await updateDoc(refBill, body);
      console.log("====> Update Billing");
      const bill = (await getDoc(refBill)).data();
      console.log(bill);
      console.log("====> get Billing");
      if (body.transaction_status == 'settlement') {
        console.log("====> settlement");
        if (bill) {
          let exp = moment().add(bill.qty, 'M').format("YYYY-MM-DD");
          
          const refCompany = doc(DB, "Company/" + bill.companyId);
          const company = (await getDoc(refCompany)).data();
          //console.log(company);
          
          
          if (company?.exp) {
            let diff = moment().diff(company.exp, 'day');
            console.log(diff);
            
            if (diff < 0) {
              exp = moment(company.exp).add(bill.qty, 'M').format("YYYY-MM-DD");
            }
              
          }
          
          console.log("====> Prepare Update Company");
          await updateDoc(refCompany, { 'level' : bill.level, 'exp' : exp, 'maxAccount': bill.account_count, 'gross_amount' : Number(bill.gross_amount), 'billingCycle' : bill.qty});
          console.log("====> Success Update Company");
          console.log(body.order_id + " - " + body.transaction_status + " Level Updated " + bill.level + " Until " + exp);
          return NextResponse.json({ 'data': 'Settlement and Upgrade Success ', 'status': '200', 'statusDesc' : 'Settlement Order '  + body.order_id});
        }
        
        console.log(body.order_id + " - " + body.transaction_status);
        console.log("====> Error Update");
        return NextResponse.json({ 'data': 'Settlement but Failed Upgrade', 'status': '200', 'statusDesc' : 'Order '  + body.order_id});
      }
      
      console.log(body.order_id + " - " + body.transaction_status);
      console.log("====> Error Service");
      return NextResponse.json({ 'data': body, 'status': '200', 'statusDesc' : 'Sukses'});
    } catch (error) {
      console.log(error);
      console.log("====> Error Catch");
      return NextResponse.json({ 'data': "Internal Server Error", 'status': '500', 'statusDesc' : 'Please contact administrator'});
    }
  
  
}