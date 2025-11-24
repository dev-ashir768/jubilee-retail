"use client";

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
import { format } from "date-fns";
import { formatNumberCell } from "@/utils/numberFormaterFunction";
import { Button } from "../shadcn/button";

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  return format(new Date(date), "MMM dd, yyyy");
};

const isUrlValid = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const trimmedUrl = url.trim();
  return trimmedUrl !== "" && trimmedUrl.toUpperCase() !== "N/A";
};

// Helper to check if a value is valid (Not Null, Not Empty, Not N/A, Not N/F)
const isValidValue = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  const strVal = String(value).trim();
  return (
    strVal !== "" &&
    strVal.toUpperCase() !== "N/A" &&
    strVal.toUpperCase() !== "N/F"
  );
};

// --- COMPONENT INTERFACE ---

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSingleData: SingleOrderPayloadTypes | null;
}

// --- MAIN COMPONENT ---

const SingleOrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onOpenChange,
  orderSingleData,
}) => {
  if (!orderSingleData) return null;

  const mainPolicy = orderSingleData.Policy?.[0];

  // 1. Policy Details Grouping
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

  // --- SMART APPLICANT LOGIC (Client/Customer) ---
  const possibleMainKeys = ["client", "customer"];

  const mainApplicantKey = policyDetailsByType
    ? Object.keys(policyDetailsByType).find((key) =>
        possibleMainKeys.includes(key.toLowerCase())
      )
    : null;

  const mainApplicantData =
    mainApplicantKey && policyDetailsByType
      ? policyDetailsByType[mainApplicantKey][0]
      : null;

  const otherPolicyTypes = policyDetailsByType
    ? Object.keys(policyDetailsByType).filter(
        (type) => type.toLowerCase() !== mainApplicantKey?.toLowerCase()
      )
    : [];

  const hasOtherPolicies = otherPolicyTypes.length > 0;

  // 2. Prepare Other Data
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

  const productInfo = mainPolicy?.product;
  const planInfo = mainPolicy?.plan;

  // --- LOGIC TO HIDE EMPTY CARDS ---

  // 1. General Details
  const generalDetailsList = [
    orderSingleData.agent_name,
    orderSingleData.branch_name,
    orderSingleData.client_id,
    orderSingleData.development_office_id,
    orderSingleData.referred_by,
    orderSingleData.coupon?.coupon_code,
    orderSingleData.cc_transaction_id,
    orderSingleData.cc_approval_code,
  ];

  // 2. Shipping Details (Updated with new fields)
  const shippingDetailsList = [
    orderSingleData.shipping_name,
    orderSingleData.shipping_address,
    orderSingleData.shipping_email,
    orderSingleData.shipping_phone,
    orderSingleData.shipping_method,
    orderSingleData.tracking_number,
    orderSingleData.courier_status,
    orderSingleData.delivery_date,
  ];

  // Check validity for both sections
  const hasGeneralDetails = generalDetailsList.some((val) => isValidValue(val));
  const hasShippingDetails = shippingDetailsList.some((val) => isValidValue(val));


  // 3. Tab Calculation
  let visibleTabs = 1; // Overview always visible
  if (hasOtherPolicies) visibleTabs++;
  if (hasTravelInfo) visibleTabs++;
  if (hasPurchaseProtectionInfo) visibleTabs++;
  if (hasHomeInsuranceInfo) visibleTabs++;

  const getTabListClass = () => {
    switch (visibleTabs) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      default: return "grid-cols-5";
    }
  };
  const tabListColsClass = getTabListClass();

  const qrDocUrl = mainPolicy?.qr_doc_url;
  const showCertificateButton = isUrlValid(qrDocUrl);

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
              <div className="flex items-center space-x-1">
                {showCertificateButton && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary hover:text-primary/90"
                    asChild
                  >
                    <a
                      href={qrDocUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Policy Certificate
                    </a>
                  </Button>
                )}
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
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className={`grid w-full ${tabListColsClass}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {hasOtherPolicies && (
                <TabsTrigger value="policy">Policy Details</TabsTrigger>
              )}
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
              {/* Summary Card */}
              <Card className="w-full shadow-none border-none bg-gray-50">
                <CardHeader className="border-b gap-0">
                  <CardTitle>Order & Policy Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Order Number" value={orderSingleData.order_code} />
                    <InfoField label="Policy Number" value={mainPolicy?.policy_code} />
                    <InfoField label="Premium" value={`PKR ${formatNumberCell(orderSingleData.payment)}`} />
                    <InfoField label="Discount" value={formatNumberCell(orderSingleData.discount_amount)} />
                    <InfoField label="Product Name" value={productInfo?.product_name} />
                    <InfoField label="Plan Name" value={planInfo?.name} />
                    <InfoField label="Issue Date" value={formatDate(mainPolicy?.issue_date)} />
                    <InfoField label="Expiry Date" value={formatDate(mainPolicy?.expiry_date)} />
                    <InfoField label="Order Create Date" value={formatDate(orderSingleData.create_date)} />
                  </div>
                </CardContent>
              </Card>

              {/* General Details Card */}
              {hasGeneralDetails && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Agent" value={orderSingleData.agent_name} />
                      <InfoField label="Branch" value={orderSingleData.branch_name} />
                      <InfoField
                        label="Client"
                        value={orderSingleData.client_id ? `Client ${orderSingleData.client_id}` : null}
                      />
                      <InfoField
                        label="Development Office (DO)"
                        value={orderSingleData.development_office_id ? `DO ${orderSingleData.development_office_id}` : null}
                      />
                      <InfoField label="Referred By" value={orderSingleData.referred_by} />
                      <InfoField label="Coupon" value={orderSingleData.coupon?.coupon_code} />
                      <InfoField label="Transaction ID" value={orderSingleData.cc_transaction_id} />
                      <InfoField label="Approval Code" value={orderSingleData.cc_approval_code} />
                    </div>
                  </CardContent>
                </Card>
              )}

               {/* --- NEW SECTION: Shipping Details --- */}
               {hasShippingDetails && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {/* New Fields */}
                      <InfoField label="Shipping Name" value={orderSingleData.shipping_name} />
                      <InfoField label="Phone" value={orderSingleData.shipping_phone} />
                      <InfoField label="Email" value={orderSingleData.shipping_email?.toLowerCase()} />
                      
                      <div className="lg:col-span-3">
                        <InfoField label="Shipping Address" value={orderSingleData.shipping_address} />
                      </div>

                      {/* Existing Fields */}
                      <InfoField label="Shipping Method" value={orderSingleData.shipping_method} />
                      <InfoField label="Tracking Number (CN)" value={orderSingleData.tracking_number} />
                      <InfoField label="Courier Status" value={orderSingleData.courier_status} />
                      <InfoField label="Delivery Date" value={formatDate(orderSingleData.delivery_date)} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Applicant Details Card */}
              {mainApplicantData && (
                <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0">
                    <CardTitle className="capitalize">
                      {mainApplicantKey} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Name" value={mainApplicantData.name} />
                      <InfoField label="CNIC" value={mainApplicantData.cnic} />
                      <InfoField label="Passport No." value={mainApplicantData.passport_no} />
                      <InfoField label="DOB" value={formatDate(mainApplicantData.dob)} />
                      <InfoField label="Age" value={mainApplicantData.age} />
                      <InfoField label="Gender" value={mainApplicantData.gender} />
                      <InfoField label="CNIC Issue Date" value={formatDate(mainApplicantData.cnic_issue_date)} />
                      <InfoField label="Phone" value={mainApplicantData.contact_number} />
                      <InfoField label="Email" value={mainApplicantData.email?.toLowerCase()} />
                      <div className="lg:col-span-3">
                        <InfoField label="Address" value={mainApplicantData.address} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* --- TAB 2: POLICY DETAILS --- */}
            {hasOtherPolicies && (
              <TabsContent
                value="policy"
                className="space-y-4 max-h-[70vh] overflow-y-auto pr-3"
              >
                {policyDetailsByType &&
                  Object.entries(policyDetailsByType)
                    .filter(
                      ([type]) =>
                        type.toLowerCase() !== mainApplicantKey?.toLowerCase()
                    )
                    .map(([type, details]) => {
                      return (
                        <Card
                          key={type}
                          className="w-full shadow-none border-none bg-gray-50"
                        >
                          <CardHeader className="border-b gap-0">
                            <CardTitle className="capitalize">
                              {type}
                              {details.length > 1 ? "s" : ""} Details
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
                                  <InfoField label="Relation" value={item.relation} />
                                  <InfoField label="CNIC" value={item.cnic} />
                                  <InfoField label="Phone" value={item.contact_number} />
                                  <InfoField label="DOB" value={formatDate(item.dob)} />
                                  <InfoField label="Age" value={item.age} />
                                  <InfoField label="Gender" value={item.gender} />
                                  <InfoField label="Passport No." value={item.passport_no} />
                                  <InfoField label="CNIC Issue Date" value={formatDate(item.cnic_issue_date)} />
                                  <div className="lg:col-span-3">
                                    <InfoField label="Address" value={item.address} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      );
                    })}
              </TabsContent>
            )}

            {/* --- OTHER TABS --- */}
            {hasTravelInfo && (
              <TabsContent value="travel" className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
                 <Card className="w-full shadow-none border-none bg-gray-50">
                  <CardHeader className="border-b gap-0"><CardTitle>Travel Information</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <InfoField label="Destination" value={travelInfo?.destination} />
                      <InfoField label="Travel Purpose" value={travelInfo?.travel_purpose} />
                      <InfoField label="Travel From" value={travelInfo?.travel_from} />
                      <InfoField label="No. of Days" value={travelInfo?.no_of_days} />
                      <InfoField label="Travel Start Date" value={formatDate(travelInfo?.travel_start_date)} />
                      <InfoField label="Travel End Date" value={formatDate(travelInfo?.travel_end_date)} />
                      <InfoField label="Institute" value={travelInfo?.institute} />
                      <InfoField label="Program" value={travelInfo?.program} />
                      <InfoField label="Program Duration" value={travelInfo?.program_duration} />
                      <InfoField label="Sponsor" value={travelInfo?.sponsor} />
                      <InfoField label="Sponsor Contact" value={travelInfo?.sponsor_contact} />
                      <div className="lg:col-span-3"><InfoField label="Sponsor Address" value={travelInfo?.sponsor_address} /></div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

             {hasPurchaseProtectionInfo && (
              <TabsContent value="purchase" className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
                {purchaseProtectionData.map((item, index) => (
                  <Card key={item.id || index} className="w-full shadow-none border-none bg-gray-50 mb-4 last:mb-0">
                    <CardHeader className="border-b gap-0"><CardTitle>Purchase Protection Item {purchaseProtectionData.length > 1 ? index + 1 : ""}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2"><InfoField label="Item Name" value={item.name} /></div>
                        <InfoField label="SKU / Retailer SKU" value={item.retailer_sku} />
                        <InfoField label="Serial Number" value={item.serial_number} />
                        <InfoField label="IMEI" value={item.imei} />
                        <InfoField label="Quantity" value={item.quantity} />
                        <InfoField label="Sum Insured" value={item.sum_insured ? `PKR ${item.sum_insured}` : null} />
                        <InfoField label="Item Price" value={item.item_price ? `PKR ${item.item_price}` : null} />
                        <InfoField label="Total Price" value={item.total_price ? `PKR ${item.total_price}` : null} />
                        <InfoField label="Duration" value={item.duration ? `${item.duration} ${item.duration_type || ""}` : null} />
                        <InfoField label="Received Premium" value={item.received_premium ? `PKR ${item.received_premium}` : null} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            )}

            {hasHomeInsuranceInfo && (
              <TabsContent value="home" className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
                {homeInsuranceData.map((item, index) => (
                  <Card key={item.id || index} className="w-full shadow-none border-none bg-gray-50 mb-4 last:mb-0">
                    <CardHeader className="border-b gap-0"><CardTitle>Home Details {homeInsuranceData.length > 1 ? index + 1 : ""}</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoField label="Ownership Status" value={item.ownership_status} />
                        <InfoField label="Structure Type" value={item.structure_type} />
                        <InfoField label="Plot Area" value={item.plot_area} />
                        <InfoField label="City" value={item.city} />
                        <InfoField label="Building Coverage" value={parseFloat(item.building) > 0 ? `PKR ${item.building}` : null} />
                        <InfoField label="Loss of Rent" value={parseFloat(item.rent) > 0 ? `PKR ${item.rent}` : null} />
                        <InfoField label="Content Coverage" value={parseFloat(item.content) > 0 ? `PKR ${item.content}` : null} />
                        <InfoField label="Jewelry Coverage" value={parseFloat(item.jewelry) > 0 ? `PKR ${item.jewelry}` : null} />
                        <div className="lg:col-span-3"><InfoField label="Insured Address" value={item.address} /></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

// --- INFO FIELD COMPONENT ---

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
      <p
        className={`mt-2 font-medium text-foreground whitespace-break-spaces capitalize`}
      >
        {displayValue}
      </p>
    </div>
  );
};

export default SingleOrderDetailDialog;