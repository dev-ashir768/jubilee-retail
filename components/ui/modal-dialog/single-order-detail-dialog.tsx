import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../shadcn/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Label } from "../shadcn/label";

import { Badge } from "../shadcn/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn/tabs";
import {
  SingleOrderPayloadTypes,
  PolicyDetailType,
} from "@/types/singleOrderType";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSingleData: SingleOrderPayloadTypes | null;
}

const SingleOrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  orderSingleData,
}) => {
  if (!orderSingleData) return null;

  const mainPolicy = orderSingleData.Policy?.[0];

  // 1. Policy Details ko "Type" ke hisaab se group karna
  const policyDetailsByType = mainPolicy?.policyDetails?.reduce(
    (acc, detail) => {
      const type = detail.type || "Other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(detail);
      return acc;
    },
    {} as Record<string, PolicyDetailType[]>
  );

  // Customer data ko alag variable mein nikal lein
  const customerPolicyData =
    policyDetailsByType && policyDetailsByType["Customer"]
      ? policyDetailsByType["Customer"][0]
      : null;

  // 2. Conditional Tabs ke liye data check karna
  const hasTravelInfo =
    mainPolicy?.PolicyTravel && mainPolicy.PolicyTravel.length > 0;
  const travelInfo = mainPolicy?.PolicyTravel?.[0];

  const hasPurchaseProtectionInfo =
    mainPolicy?.PolicyPurchaseProtection &&
    mainPolicy.PolicyPurchaseProtection.length > 0;
  const purchaseProtectionData = mainPolicy?.PolicyPurchaseProtection || [];

  const hasHomeInsuranceInfo =
    mainPolicy?.PolicyHomecare && mainPolicy.PolicyHomecare.length > 0;
  const homeInsuranceData = mainPolicy?.PolicyHomecare || [];

  // 3. Product aur Plan ki info nikalna
  const productInfo = mainPolicy?.product;
  const planInfo = mainPolicy?.plan;

  // 4. Dynamic Tab grid ke liye visible tabs count karna
  let visibleTabs = 2; // Overview & Policy Details hamesha visible hain
  if (hasTravelInfo) visibleTabs++;
  if (hasPurchaseProtectionInfo) visibleTabs++;
  if (hasHomeInsuranceInfo) visibleTabs++;

  const getTabListClass = () => {
    switch (visibleTabs) {
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      default:
        return "grid-cols-5"; // Max 5
    }
  };
  const tabListColsClass = getTabListClass();

  // --- END NAYA LOGIC ---

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-20 data-[state=open]:zoom-in-100 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-20 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-300 sm:max-w-7xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Order Details
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Order #{orderSingleData.order_code}
                </p>
              </div>
              <Badge
                variant={
                  orderSingleData.status.toLowerCase() as
                    | "accepted"
                    | "cancelled"
                    | "pendingcbo"
                }
              >
                {orderSingleData.status}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={`grid w-full ${tabListColsClass}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="policy">Policy Details</TabsTrigger>
              {hasTravelInfo && (
                <TabsTrigger value="travel">Travel</TabsTrigger>
              )}
              {hasPurchaseProtectionInfo && (
                <TabsTrigger value="purchase">Purchase Protection</TabsTrigger>
              )}
              {hasHomeInsuranceInfo && (
                <TabsTrigger value="home">Home Insurance</TabsTrigger>
              )}
            </TabsList>

            {/* --- TAB 1: OVERVIEW --- */}
            <TabsContent
              value="overview"
              className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
            >
              <Card className="w-full shadow-none border-none bg-gray-50">
                <CardHeader className="border-b gap-0">
                  <CardTitle>Order & Policy Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField
                      label="Order Number"
                      value={orderSingleData.order_code}
                    />
                    <InfoField
                      label="Policy Number"
                      value={mainPolicy?.policy_code}
                    />
                    <InfoField
                      label="Premium"
                      value={`PKR ${orderSingleData.payment}`}
                    />
                    <InfoField
                      label="Discount"
                      value={orderSingleData.discount_amount}
                    />
                    <InfoField
                      label="Product Name"
                      value={productInfo?.product_name}
                    />
                    <InfoField label="Plan Name" value={planInfo?.name} />
                    <InfoField
                      label="Issue Date"
                      value={formatDate(mainPolicy?.issue_date)}
                    />
                    <InfoField
                      label="Expiry Date"
                      value={formatDate(mainPolicy?.expiry_date)}
                    />
                    <InfoField
                      label="Order Create Date"
                      value={formatDate(orderSingleData.create_date)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full shadow-none border-none bg-gray-50">
                <CardHeader className="border-b gap-0">
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField
                      label="Agent"
                      value={orderSingleData.agent_name}
                    />
                    <InfoField
                      label="Branch"
                      value={orderSingleData.branch_name}
                    />
                    <InfoField
                      label="Client"
                      value={
                        orderSingleData.client_id
                          ? `Client ${orderSingleData.client_id}`
                          : null
                      }
                    />
                    <InfoField
                      label="Development Office (DO)"
                      value={
                        orderSingleData.development_office_id
                          ? `DO ${orderSingleData.development_office_id}`
                          : null
                      }
                    />
                    <InfoField
                      label="Referred By"
                      value={orderSingleData.referred_by}
                    />
                    <InfoField
                      label="Coupon"
                      value={orderSingleData.coupon?.coupon_code} // Assuming coupon object hai
                    />
                    <InfoField
                      label="Transaction ID"
                      value={orderSingleData.cc_transaction_id}
                    />
                    <InfoField
                      label="Approval Code"
                      value={orderSingleData.cc_approval_code}
                    />
                    <InfoField
                      label="Shipping Method"
                      value={orderSingleData.shipping_method}
                    />
                    <InfoField
                      label="Tracking Number (CN)"
                      value={orderSingleData.tracking_number}
                    />
                    <InfoField
                      label="Courier Status"
                      value={orderSingleData.courier_status}
                    />
                    <InfoField
                      label="Delivery Date"
                      value={formatDate(orderSingleData.delivery_date)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card for Policy Holder (Customer) */}
              {customerPolicyData && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Policy Holder (Customer)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Name" value={customerPolicyData.name} />
                      <InfoField label="CNIC" value={customerPolicyData.cnic} />
                      <InfoField
                        label="Passport No."
                        value={customerPolicyData.passport_no}
                      />
                      <InfoField
                        label="DOB"
                        value={formatDate(customerPolicyData.dob)}
                      />
                      <InfoField label="Age" value={customerPolicyData.age} />
                      <InfoField
                        label="Gender"
                        value={customerPolicyData.gender}
                      />
                      <InfoField
                        label="CNIC Issue Date"
                        value={formatDate(customerPolicyData.cnic_issue_date)}
                      />
                      <InfoField
                        label="Phone"
                        value={customerPolicyData.contact_number}
                      />
                      <InfoField
                        label="Email"
                        value={customerPolicyData.email}
                      />
                      <div className="lg:col-span-3">
                        <InfoField
                          label="Address"
                          value={customerPolicyData.address}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* --- TAB 2: POLICY DETAILS (DESTRUCTURED) --- */}
            <TabsContent
              value="policy"
              className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
            >
              {/* Har "Type" ke liye alag Card render hoga (Customer ko chhor kar)
                Yahan hum .filter() use kar rahe hain
              */}
              {policyDetailsByType &&
                Object.entries(policyDetailsByType)
                  .filter(([type]) => type.toUpperCase() !== "CUSTOMER")
                  .map(([type, details]) => {
                    // Ab 'details' ek array hai (e.g., 2 beneficiaries).
                    // Hum table ke bajaye InfoFields use kareinge.

                    return (
                      <Card
                        key={type}
                        className="w-full shadow-none border-none bg-gray-50"
                      >
                        <CardHeader className="border-b gap-0">
                          <CardTitle>
                            {type}
                            {details.length > 1 ? "s" : ""}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {details.map((item, index) => (
                            <div key={item.id}>
                              {details.length > 1 && (
                                <h4 className="text-lg font-medium mb-3 pb-3 border-b">
                                  {type} {index + 1}
                                </h4>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoField label="Name" value={item.name} />
                                <InfoField
                                  label="Relation"
                                  value={item.relation}
                                />
                                <InfoField label="CNIC" value={item.cnic} />
                                <InfoField
                                  label="Phone"
                                  value={item.contact_number}
                                />
                                <InfoField
                                  label="DOB"
                                  value={formatDate(item.dob)}
                                />
                                <InfoField label="Age" value={item.age} />
                                <InfoField label="Gender" value={item.gender} />
                                <InfoField
                                  label="Passport No."
                                  value={item.passport_no}
                                />
                                <InfoField
                                  label="CNIC Issue Date"
                                  value={formatDate(item.cnic_issue_date)}
                                />
                                <div className="lg:col-span-3">
                                  <InfoField
                                    label="Address"
                                    value={item.address}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
            </TabsContent>

            {/* --- TAB 3: TRAVEL (CONDITIONAL) --- */}
            {hasTravelInfo && (
              <TabsContent
                value="travel"
                className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
              >
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Travel Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField
                        label="Destination"
                        value={travelInfo?.destination}
                      />
                      <InfoField
                        label="Travel Purpose"
                        value={travelInfo?.travel_purpose}
                      />
                      <InfoField
                        label="Travel From"
                        value={travelInfo?.travel_from}
                      />
                      <InfoField
                        label="No. of Days"
                        value={travelInfo?.no_of_days}
                      />
                      <InfoField
                        label="Travel Start Date"
                        value={formatDate(travelInfo?.travel_start_date)}
                      />
                      <InfoField
                        label="Travel End Date"
                        value={formatDate(travelInfo?.travel_end_date)}
                      />
                      <InfoField
                        label="Institute"
                        value={travelInfo?.institute}
                      />
                      <InfoField label="Program" value={travelInfo?.program} />
                      <InfoField
                        label="Program Duration"
                        value={travelInfo?.program_duration}
                      />
                      <InfoField label="Sponsor" value={travelInfo?.sponsor} />
                      <InfoField
                        label="Sponsor Contact"
                        value={travelInfo?.sponsor_contact}
                      />
                      <div className="lg:col-span-3">
                        <InfoField
                          label="Sponsor Address"
                          value={travelInfo?.sponsor_address}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* --- TAB 4: PURCHASE PROTECTION (CONDITIONAL) --- */}
            {hasPurchaseProtectionInfo && (
              <TabsContent
                value="purchase"
                className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
              >
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Purchase Protection Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchaseProtectionData.map((item, index) => (
                      <pre
                        key={index}
                        className="bg-gray-100 p-3 rounded-md text-xs mt-2"
                      >
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* --- TAB 5: HOME INSURANCE (CONDITIONAL) --- */}
            {hasHomeInsuranceInfo && (
              <TabsContent
                value="home"
                className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
              >
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Home Insurance Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {homeInsuranceData.map((item, index) => (
                      <pre
                        key={index}
                        className="bg-gray-100 p-3 rounded-md text-xs mt-2"
                      >
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, highlight }) => {
  const displayValue = value;

  if (displayValue === null || displayValue === undefined) {
    return null;
  }

  if (typeof displayValue === "string") {
    const trimmedValue = displayValue.trim();
    if (
      trimmedValue === "" ||
      trimmedValue.toUpperCase() === "N/F" ||
      trimmedValue.toUpperCase() === "N/A"
    ) {
      return null;
    }
  }

  return (
    <div
      className={
        highlight
          ? "p-1.5 rounded-lg bg-primary/5 border border-primary/10"
          : ""
      }
    >
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <p className={`mt-2 font-medium text-foreground whitespace-break-spaces`}>
        {displayValue}
      </p>
    </div>
  );
};

export default SingleOrderDetailDialog;
