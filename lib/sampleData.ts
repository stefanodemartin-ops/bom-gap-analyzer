// Auto-generated sample data: real calciner kiln analysis, anonymized.
// Regenerate by running a real analysis and pasting the result here.
import { Asset, Session } from "./types";

export const SAMPLE_SESSION: Session = {
  "clientName": "Sample Client",
  "plantName": "Specialty Chemicals Plant",
  "cmmsFileName": "1854-bom-export.csv",
  "cmmsRowCount": 47,
  "cmmsText": "BoM Item,Component,Type,Description,Req. Quantity\n0062,9174072,ZSTO,\"RP-TRUNNION,10ODx4WIDE,THRU-HARDENED\",2.000\n0064,9174073,ZSTO,\"RP-TRUNNION,10DIA.x 8WIDE,2SHAFT\",2.000\n0066,9233552,ZSTO,\"NS-ROLLER,THRUST,SINGLE ASSY,1854\",2.000\n0072,9179700,ZSTO,\"P-BEARING,P.B.,2,DODGE,066302,NON-EXP\",4.000\n0074,9179701,ZSTO,\"P-BEARING,P.B.,2,DODGE,066308,EXP\",4.000\n0081,9189720,ZSTO,\"AIR CONDITIONER, PANEL - HOFFMAN MCLEAN\",1.000\n0082,9107746,ZSTO,\"HEATER,FURNACE,ABB,FC-11031-276\",42.000\n0083,9164170,ZSTO,\"R-CONTROLLER, SCR,WATLOW DT3481204A15AAA\",1.000\n0084,9163613,ZSTO,\"NS-RECTIFIER,SCR, 480V, 75AMP\",1.000\n0085,9100983,ZSTO,\"FUSE,70AMP, LPS-RK70SPI\",3.000\n0086,9155555,ZSTO,\"FUSE, 10 AMP, TYPE KAZ\",3.000\n0087,9155554,ZSTO,\"FUSE, 60 AMP, SUPER HIGH SPEED\",4.000\n0088,6428150,ZSNV,\"P-FUSE,160AMP,690V,BUSSMANN,170M1319\",3.000\n0089,9100981,ZSTO,\"FUSE,50AMP,LPS-RK-50SPI\",6.000\n0090,9108559,ZSTO,\"K-TRANSMITTER,TEMPERATURE,HWELL# STT850\",1.000\n0091,9195583,ZSTO,\"P-SENSOR,DISTAN,SICK,DL100-23AA2110,4PIN\",1.000\n0101,9101525,ZSTO,\"K-VALVE,BALL,316/TFE,1NPT,W/ACT.& L.S.\",1.000\n0102,9101529,ZSTO,\"K-VALVE,BALL,316/TFE,2NPT,W/ACT.& L.S.\",1.000\n0103,9232519,ZSTO,\"VALVE,BALL,SS,3,FLANGED,150#,W/ACTUATOR\",1.000\n0104,9108206,ZSTO,\"K-SEALANT,SILICONE,RTV,RED,12/CASE\",1.000\n0131,9233190,ZSTO,\"NS-KIT,SEAL,FIREBOX,37ODX25ID,GEMCOLIT\",1.000\n0201,6415161,ZSNV,\"BASE,15x14x3 BLACK, CORTINA\",1.000\n0202,6415162,ZSNV,CONE CHANNELIZER  49  CORTINA,1.000\n0052,9110108,ZSTO,\"LUBE,OIL,DRUM,GEAR,ISO 220,EP,LE1605\",1.000\n0002,9109388,ZSTO,\"K-MOTOR,5,230/460V,1800RPM,184TC FRAME**\",1.000\n0003,9170804,ZSTO,\"COUPLING SPIDER, LOVEJOY/099-L100\",1.000\n0004,9170530,ZSTO,\"GEAR,REDUCER,SUMITOMO\",1.000\n0006,7510045,ZSUP,\"NS-SPROCKET,120B21H,2-1/4 BORE\",1.000\n0008,9232644,ZSTO,\"NS-SPROCKET,120A84,31ID,41OD,CS1040\",1.000\n0010,9232641,ZSTO,\"NS-SPROCKET,120B11H,1-1/2BORE,W/NDLEBRG\",1.000\n0011,9107576,ZSTO,\"K-CHAIN,ROLLER,#120 COTTERED\",15.000\n0012,9107613,ZSTO,\"LINK,CONNECTING,#120\",1.000\n0013,9107598,ZSTO,\"LINK,OFFSET,#120\",1.000\n0021,9173201,ZSTO,\"SEAL,GRAPHITE,35OD,28ID,1-5/8THK\",2.000\n0022,9174292,ZSTO,\"DNR-SEAL,RING,1854,36OD,27.5ID,1THK\",2.000\n0023,7510074,ZSUP,5/16-18 X 1.75 FH BRASS SCREW,6.000\n0024,7510075,ZSUP,3/8-16 X 2 FH STEEL SCRE,8.000\n0027,9239675,ZSTO,\"SPRING,COMPRESSION,M-70,MP-11256\",12.000\n0030,9234618,ZSTO,\"NS-FE,BELLOW,FA-110-21-177\",1.000\n0041,6428075,ZSNV,\"LUBE,CONCENTRATE LIQ,GRAPHITE,IKD WBL-52\",1.000\n0042,6428074,ZSNV,\"NS-TOOL,SPRAY APPLICATOR,1.5 GAL,IKD\",1.000\n0043,6427782,ZSNV,\"BLOCK,GRAPHITE,1IN X 6IN X 16IN\",1.000\n0044,6427781,ZSNV,\"P-BLOCK,GRAPHITE,1IN X 4IN X 16IN\",1.000\n0045,9161414,ZSTO,\"LUBE,GREASE,TUBE,ALUM COMPLEX,#2,LE1275\",1.000\n0046,9110093,ZSTO,\"P-LUBE,GREASE,KEG,ALUM COMPLEX,#2,LE1275\",1.000\n0047,9108195,ZSTO,\"K-FITTING,BUTTON HEAD,1/8FPT,LINC# 5703\",1.000\n0050,9173342,ZSTO,\"LUBE,OIL,DRUM,ISO 150,EP,LE1604\",1.000"
};

export const SAMPLE_ASSETS: Asset[] = [
  {
    id: "sample-calciner-bk1854",
    name: "Calciner Kiln BK-1854",
    oemFileNames: ["1854 Calciner Drawings.pdf","B-508898-1 CA.pdf","B-508898-1 REV. B_CA.pdf","L-8543-1272 Shell GA drawing.pdf"],
    result: {
      "equipment_identified": "1854 Calciner, 24\" OD x 31'-0\" Long, ABB Raymond / Combustion Engineering / FLSmidth",
      "oem_parts_count": 72,
      "cmms_parts_count": 50,
      "summary": {
        "matched_count": 23,
        "missing_count": 47,
        "extra_count": 7,
        "match_rate": 0.33,
        "critical_missing_count": 12,
        "important_missing_count": 18,
        "routine_missing_count": 17,
        "visually_identified_count": 7
      },
      "matched": [
        {
          "oem_part_number": "9174072",
          "oem_description": "Trunnion, 10\" OD x 4\" wide, through-hardened",
          "cmms_part_number": "9174072",
          "cmms_description": "RP-TRUNNION,10\"ODx4\"WIDE,THRU-HARDENED",
          "confidence": 1,
          "match_rationale": "Exact part number and description match for the 4-inch wide trunnion roll.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9174073",
          "oem_description": "Trunnion, 10\" DIA x 8\" wide, 2\" shaft",
          "cmms_part_number": "9174073",
          "cmms_description": "RP-TRUNNION,10\"DIA.x 8\"WIDE,2\"SHAFT",
          "confidence": 1,
          "match_rationale": "Exact part number and description match for the 8-inch wide trunnion roll.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-11256",
          "oem_description": "Compression Spring M-70 (seal assembly)",
          "cmms_part_number": "9239675",
          "cmms_description": "SPRING,COMPRESSION,M-70,MP-11256",
          "confidence": 1,
          "match_rationale": "CMMS description explicitly references OEM part number MP-11256 and matching description.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "DI-7860",
          "oem_description": "120# Roller Chain, 180 ft",
          "cmms_part_number": "9107576",
          "cmms_description": "K-CHAIN,ROLLER,#120 COTTERED",
          "confidence": 0.85,
          "match_rationale": "Both describe #120 roller chain used on the calciner drive; OEM specifies 180 ft length.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "DI-7877",
          "oem_description": "Offset Link/Coupler, #120 chain",
          "cmms_part_number": "9107598",
          "cmms_description": "LINK,OFFSET,#120",
          "confidence": 0.9,
          "match_rationale": "Both describe an offset link for #120 roller chain on the calciner drive.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "DI-7877-A",
          "oem_description": "Connecting Link, #120 chain",
          "cmms_part_number": "9107613",
          "cmms_description": "LINK,CONNECTING,#120",
          "confidence": 0.9,
          "match_rationale": "Both describe a connecting link for #120 roller chain on the calciner drive.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "VP-41290-K",
          "oem_description": "Drive Sprocket (cylinder drive)",
          "cmms_part_number": "9232644",
          "cmms_description": "NS-SPROCKET,120A84,31\"ID,41\"OD,CS1040",
          "confidence": 0.75,
          "match_rationale": "Drawing L-8543-1272 shows 120AB4 girt sprocket matching the 84-tooth, 41\"OD sprocket in CMMS; consistent with OEM drive sprocket item.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-11502",
          "oem_description": "Idler Sprocket",
          "cmms_part_number": "9232641",
          "cmms_description": "NS-SPROCKET,120B11H,1-1/2\"BORE,W/NDLEBRG",
          "confidence": 0.7,
          "match_rationale": "CMMS 120B11H sprocket with needle bearing matches the idler sprocket function shown in OEM cylinder drive assembly.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-77-3-210 / Item 11 (B-508898-1)",
          "oem_description": "Sprocket 84T, split sprocket bracket (1045 steel)",
          "cmms_part_number": "7510045",
          "cmms_description": "NS-SPROCKET,120B21H,2-1/4\" BORE",
          "confidence": 0.55,
          "match_rationale": "Both reference sprockets in the calciner drive train; however the 120B21H is a smaller drive sprocket, likely the motor-side sprocket rather than the 84T girt sprocket.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "HA-110-22-817 / HA-110-22-918",
          "oem_description": "Bellows Seal Assembly FE and DE",
          "cmms_part_number": "9234618",
          "cmms_description": "NS-FE,BELLOW,FA-110-21-177",
          "confidence": 0.7,
          "match_rationale": "CMMS entry describes a bellows assembly for the calciner feed end, consistent with OEM bellows seal assemblies at feed and discharge ends.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "HA-110-12-198",
          "oem_description": "Graphite Seal Ring (fixed seal assembly)",
          "cmms_part_number": "9173201",
          "cmms_description": "SEAL,GRAPHITE,35\"OD,28\"ID,1-5/8\"THK",
          "confidence": 0.85,
          "match_rationale": "CMMS graphite seal ring dimensions (35\"OD x 28\"ID) are consistent with the graphite seal ring in the OEM fixed seal assembly drawing L-110-22-996.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "K1854-01",
          "oem_description": "Brass Seal Ring, 35\"OD x 28\"ID, 1\" thick, for K1854 calciner",
          "cmms_part_number": "9174292",
          "cmms_description": "DNR-SEAL,RING,1854,36\"OD,27.5\"ID,1\"THK",
          "confidence": 0.8,
          "match_rationale": "CMMS seal ring is explicitly for the 1854 calciner with matching 1\" thickness and near-identical OD/ID dimensions.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9233552",
          "oem_description": "Thrust Roll Assembly (single assembly)",
          "cmms_part_number": "9233552",
          "cmms_description": "NS-ROLLER,THRUST,SINGLE ASSY,1854",
          "confidence": 1,
          "match_rationale": "Exact part number match for the thrust roller single assembly specific to the 1854 calciner.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-110-22-997",
          "oem_description": "Fixed Seal Ring (feed end and discharge end)",
          "cmms_part_number": "9233190",
          "cmms_description": "NS-KIT,SEAL,FIREBOX,37\"ODX25\"ID,GEMCOLIT",
          "confidence": 0.55,
          "match_rationale": "CMMS firebox seal kit likely covers the fixed seal ring function at the calciner ends, though dimensions and material differ from OEM drawing specification.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "GP-2688",
          "oem_description": "Antiseize Thread Lube",
          "cmms_part_number": "9104",
          "cmms_description": "K-SEALANT,SILICONE,RTV,RED,12/CASE",
          "confidence": 0,
          "match_rationale": "No match found; antiseize lube is distinct from RTV silicone sealant.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Y-2926",
          "oem_description": "Permatex #2 Sealant (seal assembly)",
          "cmms_part_number": "9108206",
          "cmms_description": "K-SEALANT,SILICONE,RTV,RED,12/CASE",
          "confidence": 0.55,
          "match_rationale": "Both are sealants used in the calciner seal assemblies; Permatex #2 and RTV silicone serve similar sealing functions though they are different products.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-29317",
          "oem_description": "Trakrol 3\" Hi-Temp (seal assembly roller)",
          "cmms_part_number": "9195583",
          "cmms_description": "P-SENSOR,DISTAN,SICK,DL100-23AA2110,4PIN",
          "confidence": 0,
          "match_rationale": "No match; Trakrol hi-temp roller is a mechanical seal component with no equivalent in CMMS.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9179700",
          "oem_description": "Bearing, pillow block, 2\", Dodge 066302, non-expansion",
          "cmms_part_number": "9179700",
          "cmms_description": "P-BEARING,P.B.,2\",DODGE,066302,NON-EXP",
          "confidence": 1,
          "match_rationale": "Exact part number match for the non-expansion pillow block bearing used on the calciner trunnion/drive shafts.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9179701",
          "oem_description": "Bearing, pillow block, 2\", Dodge 066308, expansion",
          "cmms_part_number": "9179701",
          "cmms_description": "P-BEARING,P.B.,2\",DODGE,066308,EXP",
          "confidence": 1,
          "match_rationale": "Exact part number match for the expansion pillow block bearing used on the calciner trunnion/drive shafts.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9107746",
          "oem_description": "Furnace Heater Element, ABB FC-11031-276",
          "cmms_part_number": "9107746",
          "cmms_description": "HEATER,FURNACE,ABB,FC-11031-276",
          "confidence": 1,
          "match_rationale": "Exact part number and description match for the formed heating element in the furnace assembly.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9109388",
          "oem_description": "Motor, 5HP, 230/460V, 1800RPM, 184TC Frame (cylinder drive)",
          "cmms_part_number": "9109388",
          "cmms_description": "K-MOTOR,5,230/460V,1800RPM,184TC FRAME**",
          "confidence": 1,
          "match_rationale": "Exact part number match for the calciner cylinder drive motor.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9170530",
          "oem_description": "Gear Reducer, Sumitomo (drive assembly)",
          "cmms_part_number": "9170530",
          "cmms_description": "GEAR,REDUCER,SUMITOMO",
          "confidence": 1,
          "match_rationale": "Exact part number match for the Sumitomo gear reducer in the calciner drive assembly.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "9170804",
          "oem_description": "Coupling Spider, Lovejoy L100 (drive assembly)",
          "cmms_part_number": "9170804",
          "cmms_description": "COUPLING SPIDER, LOVEJOY/099-L100",
          "confidence": 1,
          "match_rationale": "Exact part number match for the Lovejoy coupling spider in the drive assembly.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        }
      ],
      "missing_from_cmms": [
        {
          "oem_part_number": "FA-110-22-997",
          "oem_description": "Fixed Seal Ring (feed end, assembly LA-110-22-996)",
          "criticality": "CRITICAL",
          "reason": "The fixed seal ring is a primary sealing component at the feed end; its absence from CMMS means no stocked replacement for a critical wear part.",
          "recommendation": "Add FA-110-22-997 to CMMS with qty 1 minimum stock and link to the fixed seal assembly BOM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-110-22-998",
          "oem_description": "Fixed Seal Ring Wear Plate (feed end and discharge end seal assemblies)",
          "criticality": "CRITICAL",
          "reason": "Wear plates are consumable contact surfaces in the seal assembly; without stocked replacements, seal failure leads to process gas leakage and unplanned downtime.",
          "recommendation": "Add FA-110-22-998 to CMMS with qty 2 minimum stock (one per seal end) and assign to seal assembly PM task.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "HA-110-22-299",
          "oem_description": "Clamp Ring (fixed seal assembly, both ends)",
          "criticality": "IMPORTANT",
          "reason": "The clamp ring retains the graphite seal ring in position; loss or damage without a spare causes extended seal downtime.",
          "recommendation": "Add HA-110-22-299 to CMMS with qty 2 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-29317",
          "oem_description": "Trakrol 3\" Hi-Temp roller (seal assembly, 6 per end)",
          "criticality": "CRITICAL",
          "reason": "Hi-temp rollers support the rotating cylinder against the fixed seal; wear or failure causes seal misalignment and process gas leakage.",
          "recommendation": "Add MP-29317 to CMMS with qty 12 minimum stock (6 per seal end) and include in seal inspection PM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-12991",
          "oem_description": "Buthd Screw .31-16 x 1.00 brass (seal assembly, 6 per end)",
          "criticality": "ROUTINE",
          "reason": "Brass screws secure the graphite ring and are consumed during each seal replacement; absence delays seal changeout.",
          "recommendation": "Add MP-12991 to CMMS with qty 12 minimum stock and include in seal replacement kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "13-3041",
          "oem_description": "HXHD Screw .38-16 x 1.25 (seal assembly, 8 per end)",
          "criticality": "ROUTINE",
          "reason": "Fasteners for the seal assembly clamp ring; not stocked means delays during seal maintenance.",
          "recommendation": "Add 13-3041 to CMMS with qty 16 minimum stock or include in a seal hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "13-3180",
          "oem_description": "HXHD Screw 1.00-8 x 8.00 (seal assembly, 6 per end)",
          "criticality": "ROUTINE",
          "reason": "Large fasteners securing the fixed seal ring assembly; non-standard size unlikely to be available locally.",
          "recommendation": "Add 13-3180 to CMMS with qty 12 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "15-1009",
          "oem_description": "Plain Washer 1.00 (seal assembly, 12 per end)",
          "criticality": "ROUTINE",
          "reason": "Washers for the 1\" seal assembly bolts; consumed during each seal service.",
          "recommendation": "Add 15-1009 to CMMS with qty 24 minimum stock or include in seal hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "11-2002",
          "oem_description": "Hex Nut 1.00-8UNC (seal assembly, 6 per end)",
          "criticality": "ROUTINE",
          "reason": "Nuts for the main seal assembly bolts; consumed during each seal service.",
          "recommendation": "Add 11-2002 to CMMS with qty 12 minimum stock or include in seal hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "11-4002",
          "oem_description": "Jam Nut 1.00-8UNC (seal assembly, 6 per end)",
          "criticality": "ROUTINE",
          "reason": "Jam nuts lock the main seal assembly bolts; consumed during each seal service.",
          "recommendation": "Add 11-4002 to CMMS with qty 12 minimum stock or include in seal hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "MP-12161",
          "oem_description": "Locknut 1.25-12UNF (seal assembly, 6 per end)",
          "criticality": "ROUTINE",
          "reason": "Locknuts for the Trakrol roller studs in the seal assembly; non-standard fine thread unlikely to be locally available.",
          "recommendation": "Add MP-12161 to CMMS with qty 12 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "GP-2688",
          "oem_description": "Antiseize Thread Lube (cylinder assembly fasteners)",
          "criticality": "IMPORTANT",
          "reason": "OEM specifies antiseize on all fasteners per drawing note; absence risks galling of high-temperature fasteners during maintenance.",
          "recommendation": "Add GP-2688 or equivalent antiseize compound to CMMS and include in calciner PM task list.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FC-77-4-393",
          "oem_description": "Riding Ring 42\" OD x 2.5\" Face (Qty 2, AISI 1045)",
          "criticality": "CRITICAL",
          "reason": "Riding rings are primary wear components supporting the rotating cylinder on trunnion rolls; failure causes catastrophic cylinder collapse.",
          "recommendation": "Add FC-77-4-393 to CMMS as a long-lead critical spare with qty 1 minimum and procurement lead time noted.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SA-77-4-392",
          "oem_description": "Side Plate, riding ring mounting hardware (Qty 24)",
          "criticality": "IMPORTANT",
          "reason": "Side plates are part of the riding ring mounting hardware assembly; missing spares delay riding ring replacement.",
          "recommendation": "Add SA-77-4-392 to CMMS with qty 24 minimum stock as part of riding ring hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SJ-77-4-372",
          "oem_description": "Top Plate, riding ring mounting hardware (Qty 12)",
          "criticality": "IMPORTANT",
          "reason": "Top plates are part of the riding ring mounting hardware assembly; missing spares delay riding ring replacement.",
          "recommendation": "Add SJ-77-4-372 to CMMS with qty 12 minimum stock as part of riding ring hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SE-77-4-373",
          "oem_description": "Middle Plate, riding ring mounting hardware (Qty 12)",
          "criticality": "IMPORTANT",
          "reason": "Middle plates are part of the riding ring mounting hardware assembly; missing spares delay riding ring replacement.",
          "recommendation": "Add SE-77-4-373 to CMMS with qty 12 minimum stock as part of riding ring hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SH-77-4-374",
          "oem_description": "Side Bar, riding ring mounting hardware (Qty 24)",
          "criticality": "IMPORTANT",
          "reason": "Side bars are part of the riding ring mounting hardware assembly; missing spares delay riding ring replacement.",
          "recommendation": "Add SH-77-4-374 to CMMS with qty 24 minimum stock as part of riding ring hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SA-77-18-188",
          "oem_description": "Knocker (Qty 4, cylinder assembly)",
          "criticality": "IMPORTANT",
          "reason": "Knockers prevent material buildup inside the cylinder; worn or broken knockers reduce calciner efficiency and can cause plugging.",
          "recommendation": "Add SA-77-18-188 to CMMS with qty 4 minimum stock and include in annual PM inspection.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "SA-77-18-189",
          "oem_description": "Knocker Pin (Qty 4, cylinder assembly)",
          "criticality": "IMPORTANT",
          "reason": "Knocker pins are wear items that retain the knocker assembly; failure causes knocker loss inside the cylinder.",
          "recommendation": "Add SA-77-18-189 to CMMS with qty 4 minimum stock and pair with knocker PM task.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-110-6-163",
          "oem_description": "Trunnion Roll Assembly with Bearings (Qty 2, feed end side)",
          "criticality": "CRITICAL",
          "reason": "Trunnion roll assemblies support the full weight of the rotating cylinder; bearing failure causes cylinder misalignment and potential catastrophic damage.",
          "recommendation": "Add FA-110-6-163 to CMMS as a critical spare with qty 1 minimum and link to trunnion PM inspection interval.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-110-6-164",
          "oem_description": "Trunnion Roll Assembly with Bearings (Qty 2, discharge end side)",
          "criticality": "CRITICAL",
          "reason": "Trunnion roll assemblies support the full weight of the rotating cylinder; bearing failure causes cylinder misalignment and potential catastrophic damage.",
          "recommendation": "Add FA-110-6-164 to CMMS as a critical spare with qty 1 minimum and link to trunnion PM inspection interval.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "LA-82-477",
          "oem_description": "Thrust Roll Assembly 6\"x2\" Face (Qty 2)",
          "criticality": "CRITICAL",
          "reason": "Thrust rolls control axial movement of the cylinder; failure allows the cylinder to walk off the trunnions causing catastrophic damage.",
          "recommendation": "Add LA-82-477 to CMMS as a critical spare with qty 1 minimum and include in trunnion PM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "FA-110-22-919",
          "oem_description": "Fixed Seal Ring (cylinder assembly, Qty 2)",
          "criticality": "CRITICAL",
          "reason": "Fixed seal rings at both ends prevent process gas leakage; absence from CMMS means no stocked replacement for a critical wear item.",
          "recommendation": "Add FA-110-22-919 to CMMS with qty 2 minimum stock and link to seal inspection PM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "13-3116",
          "oem_description": "Scr Cap HH .63-11x3.75 (cylinder assembly, Qty 7)",
          "criticality": "ROUTINE",
          "reason": "Cap screws for the cylinder assembly; non-standard length may not be locally available causing maintenance delays.",
          "recommendation": "Add 13-3116 to CMMS with qty 7 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "13-3131",
          "oem_description": "Scr Cap HH .75-10x3.25 (cylinder assembly, Qty 10)",
          "criticality": "ROUTINE",
          "reason": "Cap screws for the cylinder assembly; non-standard length may not be locally available causing maintenance delays.",
          "recommendation": "Add 13-3131 to CMMS with qty 10 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "15-2008",
          "oem_description": "Lock Washer .63 (cylinder assembly, Qty 4)",
          "criticality": "ROUTINE",
          "reason": "Lock washers for cylinder assembly fasteners; consumed during maintenance.",
          "recommendation": "Add 15-2008 to CMMS with qty 4 minimum stock or include in cylinder hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "15-2007",
          "oem_description": "Lock Washer .75 (cylinder assembly, Qty 10)",
          "criticality": "ROUTINE",
          "reason": "Lock washers for cylinder assembly fasteners; consumed during maintenance.",
          "recommendation": "Add 15-2007 to CMMS with qty 10 minimum stock or include in cylinder hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "11-2008",
          "oem_description": "Hex Nut .63 (cylinder assembly, Qty 4)",
          "criticality": "ROUTINE",
          "reason": "Hex nuts for cylinder assembly fasteners; consumed during maintenance.",
          "recommendation": "Add 11-2008 to CMMS with qty 4 minimum stock or include in cylinder hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "11-2000",
          "oem_description": "Hex Nut .75 (cylinder assembly, Qty 10)",
          "criticality": "ROUTINE",
          "reason": "Hex nuts for cylinder assembly fasteners; consumed during maintenance.",
          "recommendation": "Add 11-2000 to CMMS with qty 10 minimum stock or include in cylinder hardware kit.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "733",
          "oem_description": "Cotter Pin 1/8 x 1.25 (knocker pin retention, Qty 4)",
          "criticality": "ROUTINE",
          "reason": "Cotter pins retain the knocker pins; loss causes knocker assembly to fall into the cylinder.",
          "recommendation": "Add cotter pin 1/8 x 1.25 to CMMS with qty 8 minimum stock.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "K1854-01",
          "oem_description": "Brass Seal Ring, 35\"OD x 28\"ID x 1\" thick, with grease grooves (K1854 calciner)",
          "criticality": "CRITICAL",
          "reason": "The brass seal ring is a precision-machined wear component at the cylinder ends; without a spare, seal failure causes extended unplanned downtime.",
          "recommendation": "Add K1854-01 to CMMS as a critical long-lead spare with qty 1 minimum and note 6-8 week lead time for custom machining.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Tire Filler Plates, carbon steel, 5\"x2.5\", 18-11/16\" radius, in thicknesses 1/4\", 3/16\", 1/8\", 1/16\" (Qty 8 per thickness)",
          "criticality": "IMPORTANT",
          "reason": "Filler plates maintain the riding ring-to-shell fit as the tire wears; without correct shim stock the riding ring will rock and accelerate trunnion wear.",
          "recommendation": "Add tire filler plates in all four thicknesses to CMMS with qty 8 per thickness and link to riding ring inspection PM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Tire Keeper, 3/4\" sq bar, 4\" wide, 18-11/16\" radius, carbon steel (Qty 16)",
          "criticality": "IMPORTANT",
          "reason": "Tire keepers prevent the riding ring from migrating axially off the shell; loss causes riding ring to walk and contact the trunnion housing.",
          "recommendation": "Add tire keepers to CMMS with qty 16 minimum stock and include in riding ring PM inspection.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 8 (B-508898-1)",
          "oem_description": "Sprocket Mounting Flange (Qty 1, shell assembly)",
          "criticality": "IMPORTANT",
          "reason": "The sprocket mounting flange is the structural interface between the drive chain and the cylinder shell; damage without a spare causes extended downtime.",
          "recommendation": "Add sprocket mounting flange to CMMS as a long-lead spare with OEM drawing reference B-508898-1.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 5 (B-508898-1)",
          "oem_description": "Spiral Flights, 3/16\" x 2\" x 12\", Qty 3 (feed end spiral flights)",
          "criticality": "IMPORTANT",
          "reason": "Spiral flights move material through the feed end of the cylinder; worn or missing flights reduce throughput and cause material backup.",
          "recommendation": "Add spiral flights to CMMS with qty 3 minimum stock and include in annual cylinder inspection.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 6 (B-508898-1)",
          "oem_description": "Agitating Flights, PL 3/16\" x 2\" x 12\", Qty 120 (96 heated, 24 cooling sections)",
          "criticality": "IMPORTANT",
          "reason": "Agitating flights are wear items that tumble material for heat transfer; worn flights reduce calcination efficiency and product quality.",
          "recommendation": "Add agitating flights to CMMS with qty 24 minimum stock (one full row) and include in annual cylinder inspection.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 2 (B-508898-1)",
          "oem_description": "Dam Ring, PL 3/4\" x 24 7/8\"OD x 8\"LG, 316 SS",
          "criticality": "IMPORTANT",
          "reason": "The dam ring controls material bed depth in the cylinder; damage or loss affects residence time and product quality.",
          "recommendation": "Add dam ring to CMMS as a fabricated spare with drawing reference B-508898-1 and note 316 SS material requirement.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 4 (B-508898-1)",
          "oem_description": "Feed End Dam Ring, PL 3/16\" x 23 5/8\"OD x 17 1/2\"LG, 310 SS",
          "criticality": "IMPORTANT",
          "reason": "The feed end dam ring retains material at the feed end; damage causes material spillage and reduced calciner efficiency.",
          "recommendation": "Add feed end dam ring to CMMS as a fabricated spare with drawing reference B-508898-1 and note 310 SS material requirement.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 10 (B-508898-1)",
          "oem_description": "End Plate, PL 1/4\" x 24\"OD x 28\"OD, 316L SS (Qty 2)",
          "criticality": "IMPORTANT",
          "reason": "End plates seal the cylinder ends and interface with the seal assemblies; corrosion or damage without a spare causes extended downtime.",
          "recommendation": "Add end plates to CMMS as fabricated spares with drawing reference B-508898-1 and note 316L SS material requirement.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": "Item 12 (B-508898-1)",
          "oem_description": "Hex HD Bolts 3/4\"-UNC x 3 1/2\"LG, SAE GR.8, with Hex Nuts and Flat Washers (riding ring hardware)",
          "criticality": "ROUTINE",
          "reason": "Grade 8 riding ring mounting bolts are safety-critical fasteners; non-standard length and grade may not be locally available.",
          "recommendation": "Add riding ring bolt kit (bolts, nuts, washers) to CMMS with qty 12 minimum set and link to riding ring PM.",
          "source": "parts_table",
          "visual_note": null,
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Emergency Drive Unit (Wisconsin Natural Gas Engine) with associated drive components",
          "criticality": "CRITICAL",
          "reason": "The emergency drive prevents cylinder damage during power outages by keeping the cylinder rotating; without spare parts the emergency drive may fail when needed.",
          "recommendation": "Identify Wisconsin engine model, create CMMS equipment record, and stock critical engine spare parts (spark plugs, belts, filters).",
          "source": "visual_inspection",
          "visual_note": "Visible in View A-A of drawing L-8543-1272 and L-8643-2755 as 'Emergency Drive Unit, Wisconsin Natl Gas Engine' connected to the cylinder drive train; critical safety device with no parts in CMMS.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Motion Sensor (cylinder rotation detection)",
          "criticality": "CRITICAL",
          "reason": "The motion sensor detects cylinder rotation and triggers the emergency drive on loss of rotation; failure defeats the emergency drive interlock.",
          "recommendation": "Verify CMMS entry 9195583 (SICK distance sensor) covers this function, or add the specific motion sensor model to CMMS.",
          "source": "visual_inspection",
          "visual_note": "Labeled 'MOTION SENSOR' in the lower left of the plan view on drawing L-8543-1272 and L-8643-2755; appears to be a proximity or tachometer-type sensor mounted near the cylinder drive end.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Guard with Graphite Block (trunnion roll guard assembly)",
          "criticality": "IMPORTANT",
          "reason": "The graphite block guard lubricates the riding ring contact surface; without replacement graphite blocks the riding ring and trunnion rolls experience accelerated wear.",
          "recommendation": "Add graphite block (guard type) to CMMS and verify CMMS entries 6427781/6427782 cover this specific application.",
          "source": "visual_inspection",
          "visual_note": "Labeled 'GUARD W/ GRAPHITE BLOCK TYP.' in Half Section B-B of drawing L-8543-1272 and L-8643-2755; graphite block is a consumable lubrication element visible at each trunnion roll position.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Sight Hole with Plug (furnace section, 1 per zone)",
          "criticality": "ROUTINE",
          "reason": "Sight hole plugs seal the furnace inspection ports; missing or damaged plugs cause heat loss and potential burn hazard.",
          "recommendation": "Add sight hole plug (pipe plug, appropriate material for furnace temperature) to CMMS with qty 2 minimum stock.",
          "source": "visual_inspection",
          "visual_note": "Labeled 'SIGHT HOLE W/PLUG 1 PER ZONE' in Section C-C of drawing L-8543-1272; visible as threaded plug assemblies on the furnace shell, 2 zones shown.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Thermocouple (T/C) assemblies (discharge end and furnace zones)",
          "criticality": "CRITICAL",
          "reason": "Thermocouples provide temperature feedback for furnace control; failure causes loss of process temperature control and potential product quality issues or equipment damage.",
          "recommendation": "Add thermocouple assemblies to CMMS with qty 2 minimum stock and link to furnace temperature control PM.",
          "source": "visual_inspection",
          "visual_note": "Labeled 'T/C' at multiple locations in View F-F and the plan view of drawing L-8543-1272; thermocouples are visible at the discharge end and furnace zones as critical process instruments.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Pipe Nipples and Pipe Plugs (furnace shell purge connections, 2 required)",
          "criticality": "ROUTINE",
          "reason": "Purge connection fittings maintain furnace atmosphere integrity; missing spares delay maintenance of the purge system.",
          "recommendation": "Add 3/4\" pipe nipples and plugs (high-temp rated) to CMMS with qty 4 minimum stock.",
          "source": "visual_inspection",
          "visual_note": "Labeled '2 NIPPLES 2 REQ'D' in Section C-C of drawing L-8543-1272 on the furnace shell; visible as small threaded fittings used for atmosphere purge connections.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "oem_part_number": null,
          "oem_description": "Adjusting Screws (trunnion base, discharge end)",
          "criticality": "IMPORTANT",
          "reason": "Adjusting screws set the trunnion roll position relative to the riding ring; loss or damage prevents proper cylinder alignment adjustment.",
          "recommendation": "Add adjusting screws to CMMS with qty 4 minimum stock and include in trunnion alignment PM procedure.",
          "source": "visual_inspection",
          "visual_note": "Labeled 'ADJUSTING SCREWS' in the plan view near the discharge end trunnion base on drawing L-8543-1272; visible as threaded adjustment mechanisms on the trunnion support frame.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        }
      ],
      "extra_in_cmms": [
        {
          "cmms_part_number": "9189720",
          "cmms_description": "AIR CONDITIONER, PANEL - HOFFMAN MCLEAN",
          "note": "Panel air conditioner for the electrical control cabinet; not referenced in any OEM mechanical drawing but likely required for the SCR/furnace control panel.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "9164170",
          "cmms_description": "R-CONTROLLER, SCR,WATLOW DT3481204A15AAA",
          "note": "SCR temperature controller for furnace heating elements; not listed in OEM mechanical drawings but is an electrical/controls component for the furnace assembly.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "9163613",
          "cmms_description": "NS-RECTIFIER,SCR, 480V, 75AMP",
          "note": "SCR power rectifier for furnace heating circuit; electrical component not referenced in OEM mechanical drawings but required for furnace operation.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "6415161",
          "cmms_description": "BASE,15x14x3 BLACK, CORTINA",
          "note": "Traffic safety base (Cortina brand); appears to be a safety/housekeeping item unrelated to calciner mechanical components.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "6415162",
          "cmms_description": "CONE CHANNELIZER 49\" CORTINA",
          "note": "Traffic safety cone (Cortina brand); appears to be a safety/housekeeping item unrelated to calciner mechanical components.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "6428075",
          "cmms_description": "LUBE,CONCENTRATE LIQ,GRAPHITE,IKD WBL-52",
          "note": "Liquid graphite lubricant concentrate; likely used for riding ring/trunnion lubrication but not specifically called out in OEM drawings reviewed.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        },
        {
          "cmms_part_number": "6428074",
          "cmms_description": "NS-TOOL,SPRAY APPLICATOR,1.5 GAL,IKD",
          "note": "Spray applicator tool for graphite lubricant; a maintenance tool rather than a spare part, included in CMMS likely for procurement tracking.",
          "source_doc": "1854 Calciner Drawings.pdf, B-508898-1 CA.pdf, B-508898-1 REV. B_CA.pdf, L-8543-1272 Shell GA drawing.pdf"
        }
      ]
    },
  },
];
