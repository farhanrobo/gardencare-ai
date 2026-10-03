/**
 * Metadata for the 38 classes of the bundled MobileNetV2 plant-disease model.
 * `modelLabel` strings match the model's id2label mapping exactly.
 *
 * Summaries describe symptom patterns in general terms; guidance lists widely
 * recommended good-practice steps. Nothing here is a substitute for local,
 * professional advice — the UI always shows that disclaimer as well.
 */
export interface ClassInfo {
  id: number;
  modelLabel: string;
  plant: string;
  condition: string;
  healthy: boolean;
  summary: string;
  guidance: string[];
}

export const CLASSES: ClassInfo[] = [
  {
    id: 0,
    modelLabel: "Apple Scab",
    plant: "Apple",
    condition: "Apple scab",
    healthy: false,
    summary:
      "Apple scab is a common fungal disease that produces olive-green to dark, velvety spots on leaves and fruit. The visible pattern in this image is consistent with scab lesions.",
    guidance: [
      "Remove and dispose of heavily spotted leaves around the tree.",
      "Rake up and discard fallen leaves in autumn to reduce re-infection.",
      "Prune for better airflow so foliage dries faster.",
      "Clean pruning tools between plants.",
      "Track whether spots spread over the next week.",
    ],
  },
  {
    id: 1,
    modelLabel: "Apple with Black Rot",
    plant: "Apple",
    condition: "Black rot",
    healthy: false,
    summary:
      "Black rot on apple is a fungal disease causing reddish-brown spots that darken and enlarge, often with concentric rings. The pattern detected resembles black rot lesions.",
    guidance: [
      "Remove mummified fruit and cankered branches — they carry the fungus.",
      "Dispose of affected material away from the garden (do not compost).",
      "Prune the canopy so leaves and fruit dry quickly after rain.",
      "Avoid wounding fruit skin during picking and handling.",
      "Monitor remaining healthy fruit closely for new spots.",
    ],
  },
  {
    id: 2,
    modelLabel: "Cedar Apple Rust",
    plant: "Apple",
    condition: "Cedar apple rust",
    healthy: false,
    summary:
      "Cedar apple rust is a fungal disease that shows bright orange-yellow spots on apple leaves, spreading from nearby juniper/cedar hosts. The pattern detected matches this infection style.",
    guidance: [
      "Pick off spotted leaves while the infection is light.",
      "Check nearby juniper or cedar shrubs, which the fungus alternates on.",
      "Improve airflow around the apple tree with pruning.",
      "Avoid overhead watering that keeps leaves wet for long periods.",
      "Note resistant apple varieties for future planting if this recurs.",
    ],
  },
  {
    id: 3,
    modelLabel: "Healthy Apple",
    plant: "Apple",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf shows clean, even coloration and no visible lesions or discoloration patterns. Keep up the good care.",
    guidance: [
      "Keep scouting new growth weekly for early signs of disease.",
      "Water at the base rather than wetting the foliage.",
      "Maintain airflow with light seasonal pruning.",
      "Clear fallen leaves around the tree to interrupt disease cycles.",
    ],
  },
  {
    id: 4,
    modelLabel: "Healthy Blueberry Plant",
    plant: "Blueberry",
    condition: "Healthy",
    healthy: true,
    summary:
      "The foliage appears even and free of the lesions, spots or mottling the model associates with disease. Keep up the good care.",
    guidance: [
      "Keep the soil consistently moist but well drained.",
      "Mulch with pine bark or similar acidic mulch.",
      "Inspect new leaves every week or so during the growing season.",
      "Harvest fruit promptly when ripe to avoid disease buildup.",
    ],
  },
  {
    id: 5,
    modelLabel: "Cherry with Powdery Mildew",
    plant: "Cherry",
    condition: "Powdery mildew",
    healthy: false,
    summary:
      "Powdery mildew appears as a white to grey dusty coating on leaves and shoots. The detection resembles this common fungal surface growth.",
    guidance: [
      "Remove badly affected shoots and dispose of them away from the tree.",
      "Thin out crowded growth to improve airflow and light.",
      "Water at the base; avoid wetting leaves in the evening.",
      "Keep the area clean of fallen infected leaves.",
      "Re-check new growth weekly for the white coating returning.",
    ],
  },
  {
    id: 6,
    modelLabel: "Healthy Cherry Plant",
    plant: "Cherry",
    condition: "Healthy",
    healthy: true,
    summary:
      "No symptoms of the common cherry diseases were detected in this image. The leaf looks healthy.",
    guidance: [
      "Continue regular watering and mulching around the root zone.",
      "Prune lightly to keep the canopy open.",
      "Watch for holes or sticky residue that could indicate insects.",
      "Kick off one inspection per week during fruit development.",
    ],
  },
  {
    id: 7,
    modelLabel: "Corn (Maize) with Cercospora and Gray Leaf Spot",
    plant: "Corn (Maize)",
    condition: "Cercospora / gray leaf spot",
    healthy: false,
    summary:
      "Gray leaf spot fungi cause long, narrow, grey-to-brown lesions running parallel to leaf veins. The detected pattern matches this lesion shape.",
    guidance: [
      "Remove the most heavily infected lower leaves.",
      "Avoid overhead irrigation; water early so leaves dry by night.",
      "Space plants adequately and control weeds to improve airflow.",
      "Rotate crops next season — the fungus survives on residue.",
      "Monitor upper leaves; keep notes so you can compare next season.",
    ],
  },
  {
    id: 8,
    modelLabel: "Corn (Maize) with Common Rust",
    plant: "Corn (Maize)",
    condition: "Common rust",
    healthy: false,
    summary:
      "Common rust shows as small, cinnamon-brown pustules scattered over both leaf surfaces. The detected spots are consistent with rust pustules.",
    guidance: [
      "Remove severely affected leaves where practical.",
      "Keep rows well ventilated; avoid dense, sheltered plantings.",
      "Avoid overhead watering late in the day.",
      "Record the infection to compare rust-resistant varieties next season.",
      "Check neighboring plants for the same pustules and mark them.",
    ],
  },
  {
    id: 9,
    modelLabel: "Corn (Maize) with Northern Leaf Blight",
    plant: "Corn (Maize)",
    condition: "Northern leaf blight",
    healthy: false,
    summary:
      "Northern leaf blight produces long, cigar- or ellipse-shaped grey-green lesions on leaves. The pattern detected resembles this lesion type.",
    guidance: [
      "Remove badly blighted leaves from affected plants.",
      "Improve air movement between plants; control weeds.",
      "Water at the base and keep foliage dry where possible.",
      "Plan crop rotation to reduce residue-borne infection.",
      "Monitor new leaves for fresh lesions over the next week.",
    ],
  },
  {
    id: 10,
    modelLabel: "Healthy Corn (Maize) Plant",
    plant: "Corn (Maize)",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf surface appears clean and evenly colored, with none of the lesion patterns the model links to corn diseases. Healthy leaf.",
    guidance: [
      "Keep consistent watering, especially around tasseling.",
      "Scout undersides of leaves for insects every week.",
      "Maintain spacing and weed control for airflow.",
      "Side-dress nutrients if leaves show pale striping.",
    ],
  },
  {
    id: 11,
    modelLabel: "Grape with Black Rot",
    plant: "Grape",
    condition: "Black rot",
    healthy: false,
    summary:
      "Grape black rot is a fungal disease that forms small brown spots with dark borders on leaves, shrivels berries into black mummies. The pattern detected is consistent with black rot.",
    guidance: [
      "Remove and destroy mummified berries and spotted leaves.",
      "Prune for an open canopy so leaves dry quickly.",
      "Keep the vine floor clean of fallen debris.",
      "Avoid overhead watering during humid periods.",
      "Check bunches weekly; acted-on-early infections are easier to hold back.",
    ],
  },
  {
    id: 12,
    modelLabel: "Grape with Esca (Black Measles)",
    plant: "Grape",
    condition: "Esca (black measles)",
    healthy: false,
    summary:
      "Esca is a wood disease of grapevines; leaves develop tiger-stripe discoloration between the veins. The detected pattern resembles the leaf symptoms associated with Esca.",
    guidance: [
      "Prune out dead or cankered wood during the dormant season on dry days.",
      "Disinfect pruning tools between vines — this disease spreads via cuts.",
      "Avoid heavy pruning stress in a single season.",
      "Keep vines well watered and balanced in nutrition to reduce stress.",
      "If symptoms return strongly on the same vine, consult a local viticulture advisor.",
    ],
  },
  {
    id: 13,
    modelLabel: "Grape with Isariopsis Leaf Spot",
    plant: "Grape",
    condition: "Isariopsis leaf spot",
    healthy: false,
    summary:
      "Isariopsis leaf spot forms brown, angular spotting that can merge across the leaf. The detected pattern is consistent with this fungal spotting.",
    guidance: [
      "Remove heavily spotted leaves and clear fallen ones.",
      "Improve canopy airflow through targeted pruning.",
      "Water the roots, not the foliage.",
      "Note affected rows to prioritize them for inspection next season.",
      "Track spread weekly so you can judge whether removal is keeping up.",
    ],
  },
  {
    id: 14,
    modelLabel: "Healthy Grape Plant",
    plant: "Grape",
    condition: "Healthy",
    healthy: true,
    summary:
      "The foliage looks uniformly green without the spotting or striping patterns the model associates with vine diseases. Keep it up.",
    guidance: [
      "Keep the canopy open so morning dew dries quickly.",
      "Maintain steady watering without waterlogging.",
      "Inspect leaf undersides monthly for mildew or mites.",
      "Keep the vine floor clear to reduce disease carry-over.",
    ],
  },
  {
    id: 15,
    modelLabel: "Orange with Citrus Greening",
    plant: "Orange",
    condition: "Citrus greening (HLB)",
    healthy: false,
    summary:
      "Citrus greening (Huanglongbing) causes blotchy yellow mottling that crosses leaf veins, usually with lopsided fruit. The detected mottling pattern resembles greening symptoms.",
    guidance: [
      "Treat this as serious: contact your local agricultural extension or plant-health service for guidance.",
      "Remove severely affected branches; heavily infected trees may need removal per local rules.",
      "Manage psyllid insects — they spread the disease — with advice from local experts.",
      "Do not move plant material out of the area to avoid spreading it.",
      "Keep remaining trees well fed and watered to slow decline.",
    ],
  },
  {
    id: 16,
    modelLabel: "Peach with Bacterial Spot",
    plant: "Peach",
    condition: "Bacterial spot",
    healthy: false,
    summary:
      "Bacterial spot causes small, angular purplish spots that can drop out leaving shot-holes in leaves. The detected pattern matches bacterial spotting.",
    guidance: [
      "Prune to improve airflow so leaves dry quickly.",
      "Avoid overhead watering and working among wet plants.",
      "Remove heavily infected shoots in early season.",
      "Feed thought-fully — excess nitrogen makes trees more susceptible.",
      "Look for resistant peach varieties when replanting.",
    ],
  },
  {
    id: 17,
    modelLabel: "Healthy Peach Plant",
    plant: "Peach",
    condition: "Healthy",
    healthy: true,
    summary:
      "Leaves show normal green color and structure with none of the spotting the model associates with bacterial spot. Healthy foliage.",
    guidance: [
      "Thin fruit lightly so branches aren't overloaded.",
      "Water deeply but not too often; keep foliage dry.",
      "Check new growth weekly in spring.",
      "Keep a ring of mulch clear of the trunk to reduce pests.",
    ],
  },
  {
    id: 18,
    modelLabel: "Bell Pepper with Bacterial Spot",
    plant: "Bell Pepper",
    condition: "Bacterial spot",
    healthy: false,
    summary:
      "Bacterial spot on peppers produces water-soaked patches that turn dark and angular on leaves. The detected pattern is consistent with bacterial infection.",
    guidance: [
      "Remove and discard infected leaves and fruits — do not compost.",
      "Do not work with plants while wet; bacteria spread easily on wet hands and tools.",
      "Clean supports, pots and tools between seasons.",
      "Improve airflow and avoid overhead watering.",
      "Rotate peppers away from this spot next season.",
    ],
  },
  {
    id: 19,
    modelLabel: "Healthy Bell Pepper Plant",
    plant: "Bell Pepper",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf looks even in color and texture without the dark or water-soaked patterns of bacterial spot. Healthy pepper foliage.",
    guidance: [
      "Water consistently at the base — peppers dislike extremes of wet and dry.",
      "Mulch to keep soil moisture steady.",
      "Scout leaf undersides for aphids and mites weekly.",
      "Stake plants so leaves don't sit on wet soil.",
    ],
  },
  {
    id: 20,
    modelLabel: "Potato with Early Blight",
    plant: "Potato",
    condition: "Early blight",
    healthy: false,
    summary:
      "Early blight is a fungal disease that starts as small dark spots on older leaves, enlarging with target-like concentric rings. The detected pattern matches early blight.",
    guidance: [
      "Remove the most affected lower leaves to slow spread.",
      "Avoid overhead watering, especially late in the day.",
      "Mulch around plants so spores aren't splashed up from the soil.",
      "Give plants space for airflow between rows.",
      "Check new growth every few days; if spots accelerate, ask a local grower or extension service about treatment.",
    ],
  },
  {
    id: 21,
    modelLabel: "Potato with Late Blight",
    plant: "Potato",
    condition: "Late blight",
    healthy: false,
    summary:
      "Late blight produces irregular water-soaked patches that spread rapidly in cool, wet conditions, often with pale mold at the underside. The detected pattern matches late blight and can spread fast.",
    guidance: [
      "Act quickly: remove and destroy (bag, don't compost) affected foliage.",
      "Do not water overhead; keep foliage dry whenever possible.",
      "Improve airflow between rows by cutting back dense foliage only as needed.",
      "Check plants daily during wet weather for fast-moving patches.",
      "Consult your local agricultural extension service promptly — late blight can destroy a crop.",
    ],
  },
  {
    id: 22,
    modelLabel: "Healthy Potato Plant",
    plant: "Potato",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf appears clean with no water-soaked patches or spreading dark spots. Healthy potato foliage.",
    guidance: [
      "Keep hilling soil around stems to protect developing tubers.",
      "Water deeply and infrequently; let foliage dry between waterings.",
      "Watch for late blight after cool, wet spells — check daily.",
      "Keep rows weeded to maintain airflow.",
    ],
  },
  {
    id: 23,
    modelLabel: "Healthy Raspberry Plant",
    plant: "Raspberry",
    condition: "Healthy",
    healthy: true,
    summary:
      "No signs of the common raspberry leaf diseases were detected — color and texture look normal.",
    guidance: [
      "Prune out old fruiting canes after harvest.",
      "Keep plants watered through dry spells, especially while fruiting.",
      "Tie canes to supports so air moves through the patch.",
      "Check for aphids on new shoots weekly.",
    ],
  },
  {
    id: 24,
    modelLabel: "Healthy Soybean Plant",
    plant: "Soybean",
    condition: "Healthy",
    healthy: true,
    summary:
      "The foliage shows no lesion or discoloration patterns associated with soybean leaf diseases. Looks healthy.",
    guidance: [
      "Scout for insects and spots weekly, focusing on lower leaves.",
      "Keep the field or bed free of weed hosts.",
      "Avoid working among plants when wet.",
      "Rotate with non-legume crops next season.",
    ],
  },
  {
    id: 25,
    modelLabel: "Squash with Powdery Mildew",
    plant: "Squash",
    condition: "Powdery mildew",
    healthy: false,
    summary:
      "Powdery mildew appears as white powdery patches that coat squash leaves late in the season. The detected pattern matches this surface growth.",
    guidance: [
      "Remove the worst-affected older leaves to improve airflow.",
      "Water the soil, not the leaves, and do it in the morning.",
      "Give vines room; crowded foliage invites mildew.",
      "Keep plants vigorous — stressed plants succumb faster.",
      "Track spread; if it accelerates on fruit-bearing vines, ask local growers for options.",
    ],
  },
  {
    id: 26,
    modelLabel: "Strawberry with Leaf Scorch",
    plant: "Strawberry",
    condition: "Leaf scorch",
    healthy: false,
    summary:
      "Leaf scorch on strawberry causes small dark purple spots that merge, giving leaves a burnt appearance. The detected pattern matches this spotting.",
    guidance: [
      "Remove and discard affected leaves; thin the bed for airflow.",
      "Water at the roots and keep foliage dry when possible.",
      "Renovate beds after harvest: clear old foliage as recommended locally.",
      "Mulch between plants to reduce splash from the soil.",
      "Replant with healthy stock in new ground if the bed is older and struggling.",
    ],
  },
  {
    id: 27,
    modelLabel: "Healthy Strawberry Plant",
    plant: "Strawberry",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf is evenly green with clean margins — no scorch spotting detected. Healthy strawberry foliage.",
    guidance: [
      "Keep berries off bare soil with straw or mats.",
      "Water consistently during flowering and fruiting.",
      "Remove runners if you want bigger fruit.",
      "Check for aphids and mites on new leaves weekly.",
    ],
  },
  {
    id: 28,
    modelLabel: "Tomato with Bacterial Spot",
    plant: "Tomato",
    condition: "Bacterial spot",
    healthy: false,
    summary:
      "Bacterial spot forms small, dark, greasy-looking spots on tomato leaves and fruit. The detected pattern is consistent with this bacterial infection.",
    guidance: [
      "Remove affected leaves and fruit; do not compost them.",
      "Never handle plants while wet — bacteria spread on wet hands and tools.",
      "Stake plants and prune lightly so leaves aren't splashed by soil.",
      "Sanitize tools and support strings between uses.",
      "Rotate tomatoes away from this bed next season.",
    ],
  },
  {
    id: 29,
    modelLabel: "Tomato with Early Blight",
    plant: "Tomato",
    condition: "Early blight",
    healthy: false,
    summary:
      "Early blight shows up as lower-leaf dark spots with concentric rings, slowly working upward. The pattern detected is commonly associated with early blight.",
    guidance: [
      "Inspect nearby leaves for similar symptoms.",
      "Remove severely affected lower leaves if appropriate.",
      "Avoid unnecessary overhead watering — keep foliage dry.",
      "Mulch to stop soil spores splashing onto leaves.",
      "Monitor the plant over the next few days and note any spread.",
    ],
  },
  {
    id: 30,
    modelLabel: "Tomato with Late Blight",
    plant: "Tomato",
    condition: "Late blight",
    healthy: false,
    summary:
      "Late blight causes greasy, grey-green patches that spread quickly in humid weather and can rot fruit. The detected pattern matches late blight.",
    guidance: [
      "Remove and destroy affected foliage immediately — bag it, don't compost.",
      "Check plants daily while weather is wet and cool.",
      "Keep foliage dry; water the soil only.",
      "Increase spacing or open the canopy so plants dry quickly.",
      "Act fast and ask local growers or extension services — this disease can take a whole crop.",
    ],
  },
  {
    id: 31,
    modelLabel: "Tomato with Leaf Mold",
    plant: "Tomato",
    condition: "Leaf mold",
    healthy: false,
    summary:
      "Leaf mold develops in humid conditions as pale yellow patches on the upper leaf with velvety mold underneath. The detected pattern is consistent with leaf mold.",
    guidance: [
      "Improve ventilation around plants — this is a humidity-loving fungus.",
      "Remove affected leaves and keep the ground clear of debris.",
      "Avoid wetting leaves; water early at the base.",
      "In greenhouses, open vents and reduce evening humidity.",
      "Watch upper leaves for pale patches over the next week.",
    ],
  },
  {
    id: 32,
    modelLabel: "Tomato with Septoria Leaf Spot",
    plant: "Tomato",
    condition: "Septoria leaf spot",
    healthy: false,
    summary:
      "Septoria leaf spot produces many small circular spots with light centers and dark rims, usually starting low on the plant. The detected pattern matches this spotting.",
    guidance: [
      "Remove heavily spotted lower leaves to slow the spread upward.",
      "Mulch to stop spores splashing from the soil.",
      "Keep watering at the base, in the morning.",
      "Stake or cage plants to keep foliage off the ground.",
      "Monitor new growth for fresh spots over the coming days.",
    ],
  },
  {
    id: 33,
    modelLabel: "Tomato with Spider Mites or Two-spotted Spider Mite",
    plant: "Tomato",
    condition: "Spider mites",
    healthy: false,
    summary:
      "Spider mite damage appears as fine yellow stippling, often with tiny webbing on leaf undersides. The detected textural pattern is consistent with mite feeding.",
    guidance: [
      "Check leaf undersides and look for fine webbing and specks.",
      "Rinse leaves (especially undersides) with a firm spray of water.",
      "Encourage beneficial insects like ladybirds and predatory mites.",
      "Keep plants well watered — drought stress invites mites.",
      "If damage grows, ask a local garden centre about insecticidal soap suitable for food crops.",
    ],
  },
  {
    id: 34,
    modelLabel: "Tomato with Target Spot",
    plant: "Tomato",
    condition: "Target spot",
    healthy: false,
    summary:
      "Target spot forms brown lesions with faint concentric rings, similar to early blight but often on multiple plant parts. The detected pattern matches target spotting.",
    guidance: [
      "Remove affected leaves and stems and dispose of them.",
      "Improve airflow by staking and pruning lower growth.",
      "Keep foliage dry — water at the base, in the morning.",
      "Keep the surrounding ground free of fallen plant debris.",
      "Photograph changes over the next few days to track spread.",
    ],
  },
  {
    id: 35,
    modelLabel: "Tomato Yellow Leaf Curl Virus",
    plant: "Tomato",
    condition: "Yellow leaf curl virus",
    healthy: false,
    summary:
      "Yellow leaf curl virus makes new leaves curl upward, yellow at the edges, and plants become stunted. The detected leaf pattern is consistent with virus symptoms.",
    guidance: [
      "Remove severely affected plants — viruses cannot be cured.",
      "Control whiteflies, which spread the virus, on remaining plants.",
      "Use yellow sticky traps to monitor whitefly activity.",
      "Wash hands and tools after handling infected plants.",
      "Choose virus-resistant tomato varieties next season.",
    ],
  },
  {
    id: 36,
    modelLabel: "Tomato Mosaic Virus",
    plant: "Tomato",
    condition: "Mosaic virus",
    healthy: false,
    summary:
      "Mosaic virus creates mottled light-and-dark green patterns, sometimes with leaf distortion. The detected pattern is consistent with mosaic virus.",
    guidance: [
      "Remove and destroy affected plants; the virus has no cure.",
      "Wash hands and disinfect tools — mosaic spreads very easily.",
      "Avoid smoking or handling tobacco near plants (a related virus risk).",
      "Control aphids that can carry the virus between plants.",
      "Sanitize stakes, cages and pots before reuse.",
    ],
  },
  {
    id: 37,
    modelLabel: "Healthy Tomato Plant",
    plant: "Tomato",
    condition: "Healthy",
    healthy: true,
    summary:
      "The leaf is evenly colored with no spotting, mottling or curl patterns the model associates with tomato diseases. Healthy foliage.",
    guidance: [
      "Keep watering at the base and consistent — tomatoes dislike swings.",
      "Feed lightly at flowering and fruiting stages.",
      "Prune suckers as needed for airflow.",
      "Scout weekly for signs of early blight on lower leaves.",
    ],
  },
];

export function getClassInfo(classId: number): ClassInfo {
  return CLASSES[classId] ?? CLASSES[0];
}

export function isHealthyClass(classId: number): boolean {
  return getClassInfo(classId).healthy;
}
