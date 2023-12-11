type PageTitleProps = {
  title: string;
};

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <>
      <div className="border-y border-solid border-primary/50">
        <div className="container flex justify-between">
          <div className="border-x-primborder-primary/50  flex h-full w-36 items-center justify-center border-x border-solid px-2 py-3">
            <h1 className="border-primary text-lg font-bold uppercase text-primary">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageTitle;
