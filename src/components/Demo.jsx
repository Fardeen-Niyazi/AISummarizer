import React, { useState, useEffect } from "react";
import IMAGES from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
import { useSpeechSynthesis } from "react-speech-kit";

function Demo() {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticals, setAllArticals] = useState([]);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [copiedUrl, setCopieUrl] = useState("");
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSumbit = async (e) => {
    e.preventDefault();
    cancel();
    setIsSpeaking(false);
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updateAllArticals = [newArticle, ...allArticals];
      setArticle(newArticle);
      setAllArticals(updateAllArticals);
      localStorage.setItem("articles", JSON.stringify(updateAllArticals));
    }
  };

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
    if (articlesFromLocalStorage) {
      setAllArticals(articlesFromLocalStorage);
    }
  }, [article]);

  const handleCopyUrl = (copyUrl) => {
    setCopieUrl(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopieUrl(false), 3000);
  };

  const handleSpeakClick = () => {
    if (speaking) {
      cancel();
      setIsSpeaking(false);
    } else {
      speak({ text: article.summary });
      setIsSpeaking(true);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full">
        <form className="relative flex justify-center items-center" onSubmit={handleSumbit}>
          <img src={IMAGES.linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5" />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peerr-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
        {/* Browser URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticals.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => {
                cancel();
                setIsSpeaking(false);
                setArticle(item);
              }}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopyUrl(item.url)}>
                <img
                  src={copiedUrl === item.url ? IMAGES.tick : IMAGES.copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi  text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Dispaly Results */}
      <div className="my-10 max-w-4 flex justify-center items-center">
        {isFetching ? (
          <img src={IMAGES.loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, That wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">{error?.data?.error}</span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <button onClick={handleSpeakClick} style={{ marginRight: "10px" }}>
                <img
                  src={isSpeaking ? IMAGES.speaker : IMAGES.speakerOff}
                  alt="Speaker Icon"
                  style={{ width: "20px", height: "20px" }}
                />
              </button>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm">{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo;
