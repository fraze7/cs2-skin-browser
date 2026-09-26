// Sample listings used as fallback when the live CSFloat API is unavailable.
// Shape matches the real API response: { data: Listing[] }
// icon_url is the bare Steam economy image hash, exactly as CSFloat returns it —
// SkinCard builds the full CDN URL.
// rarity uses CSFloat's numeric scale: 1 Consumer … 6 Covert, 7 = ★ knives/gloves.

function listing(id, price, item) {
  return {
    id: `sample-${id}`,
    price,
    type: 'buy_now',
    item: { is_stattrak: false, is_souvenir: false, ...item },
  }
}

export const sampleListings = [
  listing(1, 349900, {
    market_hash_name: 'AK-47 | Redline (Field-Tested)',
    float_value: 0.2341,
    wear_name: 'Field-Tested',
    rarity: 5,
    def_index: 7,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzOtyufRkASq2lkxx4W-HnNyqJC3FZwYoC5p0Q7FfthW6wdWxPu-371Pdit5HnyXgznQeHYY5wyA',
  }),
  listing(2, 189500, {
    market_hash_name: 'AWP | Asiimov (Field-Tested)',
    float_value: 0.2967,
    wear_name: 'Field-Tested',
    rarity: 6,
    def_index: 9,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ',
  }),
  listing(3, 2450000, {
    market_hash_name: '★ Karambit | Fade (Factory New)',
    float_value: 0.0312,
    wear_name: 'Factory New',
    rarity: 7,
    def_index: 507,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SD1iWwOpzj-1gSCGn20tztm_UyIn_JHKUbgYlWMcmQ-ZcskSwldS0MOnntAfd3YlMzH35jntXrnE8SOGRGG8',
  }),
  listing(4, 89900, {
    market_hash_name: 'StatTrak™ M4A1-S | Hyper Beast (Minimal Wear)',
    float_value: 0.0823,
    wear_name: 'Minimal Wear',
    rarity: 6,
    def_index: 60,
    is_stattrak: true,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9JuPh5SjuMlxgmoCm6lob-KT-JbwF1WZEjR-YJskK9k9XiYePltAeNjYlAxSn5j34dvCZstb4LB6Ut-7qX0V8Xkv5_2A',
  }),
  listing(5, 54200, {
    market_hash_name: 'Glock-18 | Fade (Factory New)',
    float_value: 0.0191,
    wear_name: 'Factory New',
    rarity: 4,
    def_index: 4,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So',
  }),
  listing(6, 32100, {
    market_hash_name: 'USP-S | Kill Confirmed (Minimal Wear)',
    float_value: 0.1102,
    wear_name: 'Minimal Wear',
    rarity: 6,
    def_index: 61,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160',
  }),
  listing(7, 127600, {
    market_hash_name: 'Desert Eagle | Blaze (Factory New)',
    float_value: 0.0088,
    wear_name: 'Factory New',
    rarity: 4,
    def_index: 1,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU',
  }),
  listing(8, 615000, {
    market_hash_name: "★ Sport Gloves | Pandora's Box (Field-Tested)",
    float_value: 0.3551,
    wear_name: 'Field-Tested',
    rarity: 7,
    def_index: 5030,
    icon_url: 'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Tk5UvzWCL2kpn2-DFk_OKherB0H-CGHHecxNF7teVgWiT9wU4jsmyDyt74dn-WOwUhApchQLYD4Rm4ktDlMbzjs1DajtlCmy6vijQJsHhHS4AXoA',
  }),
]
