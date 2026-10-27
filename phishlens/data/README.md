# PhishLens Dataset Documentation

## Dataset Sources & Provenance

PhishLens uses a curated, balanced benchmark dataset composed of verified phishing URLs and high-reputation benign web portals:

1. **Phishing URLs**:
   - Sourced from [PhishTank](https://phishtank.org/) — a collaborative clearing house for data and information about phishing on the Internet.
   - Verified community-confirmed phishing submissions with active credential-harvesting mechanisms.
   - Permitted usage: Open research and cybersecurity evaluation under PhishTank API Developer Terms.

2. **Benign URLs**:
   - Sourced from the [Tranco Top 1M Research List](https://tranco-list.eu/) and verified domain rankings (Google, Wikipedia, GitHub, Scikit-learn, Government portals).
   - Filtered for top-ranked legitimate websites with multi-year registration history.

## Preprocessing & Zero-Leakage Split

- **Deduplication**: Duplicate URLs and identical subpaths are pruned.
- **Protocol Normalization**: URLs are verified for valid syntactic schemes (`http://` or `https://`).
- **Data Splitting**: 80% training set and 20% held-out test set, stratified by the ground truth label to avoid class distribution shifts and prevent data leakage.
- **Class Balance**: Maintained at realistic distributions with non-linear feature perturbations to train robust decision boundaries against zero-day URL obfuscation.
