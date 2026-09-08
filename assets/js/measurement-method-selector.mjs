const form = document.getElementById("measurementSelectorForm");
const purpose = document.getElementById("measurementPurpose");
const followup = document.getElementById("measurementSelectorFollowup");
const samplingPreference = document.getElementById("measurementSamplingPreference");
const resetButton = document.getElementById("measurementSelectorReset");
const result = document.getElementById("measurementSelectorResult");
const resultTitle = document.getElementById("measurementSelectorResultTitle");
const resultPrimary = document.getElementById("measurementSelectorResultPrimary");
const resultBody = document.getElementById("measurementSelectorResultBody");

if (form && purpose && followup && samplingPreference && resetButton && result && resultTitle && resultPrimary && resultBody) {
  const routes = {
    exposure: {
      title: "個人ばく露測定を確認",
      primary: "作業者の呼吸域におけるばく露を把握する目的なら、個人ばく露測定が候補です。",
      body: `
        <p><strong>次に確認：</strong>測定目的、対象作業者、均等ばく露作業、測定時間、比較する評価基準を決めます。</p>
        <ul>
          <li><a href="../../guides/personal-exposure-measurement-basics/">個人ばく露測定の基礎</a></li>
          <li><a href="../../qa/personal-exposure-measurement-2026/">2026年10月以降の実施者要件</a></li>
        </ul>
        <p>個人ばく露測定の結果を、そのまま作業環境測定の管理区分として扱うものではありません。</p>`
    },
    "concentration-standard": {
      title: "確認測定の要否・方法を確認",
      primary: "濃度基準値設定物質では、リスクアセスメントの結果等から確認測定が必要かを検討します。",
      body: `
        <p><strong>次に確認：</strong>対象物質の八時間・短時間濃度基準値、作業条件、ばく露の変動、最大ばく露が想定される労働者を確認します。</p>
        <ul>
          <li><a href="../../substances/?filter=concentration">濃度基準値設定物質を検索</a></li>
          <li><a href="../../guides/management-concentration-exposure-limits/">管理濃度・濃度基準値の違い</a></li>
        </ul>
        <p>濃度基準値設定物質だから一律に毎回測定する、という判定にはしません。</p>`
    },
    "third-class": {
      title: "第3管理区分の保護具選定用測定を確認",
      primary: "改善が困難と判断された第3管理区分では、個別規則に基づく濃度測定と要求防護係数の確認が関係します。",
      body: `
        <p><strong>次に確認：</strong>対象規則、有機溶剤・鉛・特定化学物質・粉じんの別、採用する測定方法、測定結果 C と基準値 C₀を確認します。</p>
        <ul>
          <li><a href="../respirator-protection-factor/">要求防護係数を計算</a></li>
          <li><a href="../../qa/third-control-class/">第3管理区分の対応順序</a></li>
        </ul>
        <p>保護具選定は設備・工程の改善に代わるものではありません。改善措置と並行して確認します。</p>`
    },
    welding: {
      title: "溶接ヒューム測定を確認",
      primary: "継続して金属アーク溶接等作業を行う屋内作業場では、新たな作業方法の採用・変更時の測定要件を確認します。",
      body: `
        <p><strong>次に確認：</strong>作業方法の新規採用・変更の有無、測定対象者、サンプリング・分析方法、実施者要件を確認します。</p>
        <ul>
          <li><a href="../../qa/personal-exposure-measurement-2026/">2026年10月以降の実施者要件</a></li>
          <li><a href="../../personal-exposure-measurement/">個人ばく露測定カテゴリ</a></li>
        </ul>
        <p>単純な「年1回の定期測定」として扱わず、特化則の溶接ヒューム関係規定を確認してください。</p>`
    }
  };

  const workEnvironmentRoute = () => {
    const preference = samplingPreference.value;
    if (preference === "yes") {
      return {
        title: "C・D測定（個人サンプリング法）の対象を確認",
        primary: "管理区分を求める作業環境測定で身体装着型の採取を検討する場合は、C・D測定を選択できる対象物質・条件を確認します。",
        body: `
          <p>C・D測定は<strong>個人の健康リスクそのものではなく、単位作業場所を評価する作業環境測定</strong>です。</p>
          <ul>
            <li><a href="../../guides/personal-sampling-target-substances/">個人サンプリング法の対象物質</a></li>
            <li><a href="../../qa/personal-sampling-ab-measurement/">A・B測定との使い分け</a></li>
          </ul>
          <p>対象外の物質・条件ではA・B測定等、該当する作業環境測定方法を確認してください。</p>`
      };
    }
    if (preference === "no") {
      return {
        title: "A・B測定を確認",
        primary: "単位作業場所の管理状態を評価する基本的な作業環境測定として、A測定と必要に応じてB測定を確認します。",
        body: `
          <p><strong>A測定：</strong>単位作業場所の平均的な状態を把握します。<br><strong>B測定：</strong>発散源近傍など、最も高濃度になると考えられる位置・時間の濃度を確認します。</p>
          <ul>
            <li><a href="../management-class/">管理区分判定ツール</a></li>
            <li><a href="../../guides/work-environment-measurement-design-sampling/">デザイン・サンプリングの実務</a></li>
          </ul>`
      };
    }
    return {
      title: "A・B測定とC・D測定の適用を先に確認",
      primary: "管理区分を求める目的なら作業環境測定です。A・B測定かC・D測定かは、対象物質・作業条件と測定基準を確認して選びます。",
      body: `
        <ul>
          <li><a href="../../qa/personal-sampling-ab-measurement/">A・B測定とC・D測定の使い分け</a></li>
          <li><a href="../../guides/personal-sampling-target-substances/">C・D測定の対象物質</a></li>
          <li><a href="../../work-environment-measurement/">作業環境測定の基礎</a></li>
        </ul>`
    };
  };

  const syncFollowup = () => {
    followup.hidden = purpose.value !== "work-environment";
  };

  purpose.addEventListener("change", syncFollowup);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!purpose.value) {
      resultTitle.textContent = "目的を選択してください";
      resultPrimary.textContent = "評価したい対象を選ぶと、確認する測定を表示します。";
      resultBody.innerHTML = "<p>作業場の管理状態、個人ばく露、濃度基準値、第3管理区分、溶接ヒュームのどれを確認するか選択してください。</p>";
      purpose.focus();
      return;
    }

    const route = purpose.value === "work-environment" ? workEnvironmentRoute() : routes[purpose.value];
    if (!route) return;
    resultTitle.textContent = route.title;
    resultPrimary.textContent = route.primary;
    resultBody.innerHTML = route.body;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    syncFollowup();
    resultTitle.textContent = "目的を選択してください";
    resultPrimary.textContent = "測定名より先に、何を評価するかを決めます。";
    resultBody.innerHTML = "<p>選択後に、候補となる測定、評価対象、次に確認するページを表示します。</p>";
    purpose.focus();
  });

  syncFollowup();
}
