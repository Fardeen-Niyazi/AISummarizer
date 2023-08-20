import React from 'react'
import IMAGES from '../assets'

function Hero() {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center flex-row w-full mb-10 pt-3">
        <img
          src={IMAGES.logo}
          alt="sumz_logo"
          className="w-28 object-contain"
        />
        <button
          type="button"
          onClick={() => {
            window.open("https://github.com/");
          }}
          className="black_btn"
        >
          Github
        </button>
      </nav>
      <h1 className="head_text">
        Summarize Articles with <br />
        <span className="orange_gradient">OpenAI GPT-4</span>
      </h1>
      <h2 className="desc">
        Simplify your reading with Summirizer, an open-source article summarizer
        that transforms lengtht articles into clear and concise summaries.
      </h2>
    </header>
  );
}

export default Hero